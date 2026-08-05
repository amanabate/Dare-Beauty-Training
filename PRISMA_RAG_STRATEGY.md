# Natural Language to Prisma Query Mapping Strategy
**Engine Target:** Groq `llama-3.1-8b-instant` / Node.js Backend RAG System  
**Framework:** Prisma ORM v5+ with NestJS / Express  

---

## 1. Executive Summary & Architectural Overview

To deliver reliable, sub-second responses for administrative queries (e.g., *"Show me attendance for this month"* or *"Which students have unpaid tuition balances?"*), the backend utilizes a **2-Stage Hybrid Intent & Entity Extraction Pipeline**:

```
[ Natural Language Query ]
           │
           ▼
Stage 1: Intent & Entity Extraction (Fast Classifier / LLM JSON Schema)
  ├── Extract Target Entity: (Attendance | Student | Payment | Course | Result)
  ├── Extract Target Action: (LIST | COUNT | AGGREGATE | FILTER_LOW)
  └── Extract Filters: { dateRange, status, thresholds, courseName }
           │
           ▼
Stage 2: Deterministic Prisma Mapper Service
  ├── Selects exact Prisma Model method (e.g., prisma.attendance.groupBy)
  ├── Constructs strongly-typed `where`, `select`, `orderBy`, `take` clauses
  └── Executes database query safely
           │
           ▼
Stage 3: Grounded Context Injection -> LLM Synthesis
```

---

## 2. Entity Extraction Schema (LLM JSON Function Call)

Before querying PostgreSQL, the LLM analyzes the user prompt and emits a structured JSON payload conforming to the following schema:

```json
{
  "targetEntity": "Attendance | Student | Payment | Course | Result",
  "action": "COUNT | FIND_MANY | AGGREGATE | GROUP_BY",
  "filters": {
    "dateRange": {
      "start": "ISO8601 String or relative token (e.g. THIS_MONTH)",
      "end": "ISO8601 String"
    },
    "status": "ACTIVE | PENDING | PAID | PASSED | FAILED | ALERT",
    "threshold": "Number (e.g., 75 for attendance <75%)",
    "courseName": "String optional filter"
  },
  "limit": "Number (default: 20)"
}
```

---

## 3. Prisma Model Mapping Matrix

| Natural Language Keyword / Concept | Target Prisma Model | Extracted Entity | Dispatched Prisma Function |
| :--- | :--- | :--- | :--- |
| **"attendance", "absent", "present"** | `prisma.attendance` | `Attendance` | `findMany` / `groupBy` with date filter |
| **"payment", "fee", "tuition", "due"** | `prisma.payment` | `Payment` | `findMany({ where: { status: "PENDING" } })` |
| **"student", "enrolled", "registered"**| `prisma.student` | `Student` | `count()` / `findMany()` by course |
| **"certificate", "passed", "grade"** | `prisma.result` | `Result` | `findMany({ where: { competency: "PASS" } })` |
| **"course", "program", "barbering"** | `prisma.course` | `Course` | `findUnique()` with relations |

---

## 4. Date Range & Filter Normalization Rules

When relative tokens (such as *"this month"*, *"last week"*, *"today"*) are detected, the normalization layer computes exact ISO timestamps prior to invoking Prisma:

```typescript
export function resolveDateRange(token?: string): { gte?: Date; lte?: Date } {
  const now = new Date();
  if (token === 'THIS_MONTH' || token === 'this month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { gte: startOfMonth, lte: endOfMonth };
  }
  if (token === 'TODAY') {
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const endOfDay = new Date(now.setHours(23,59,59,999));
    return { gte: startOfDay, lte: endOfDay };
  }
  return {};
}
```

---

## 5. End-to-End Implementation Example (Prisma Mapping Dispatcher)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function dispatchPrismaQuery(extractedJSON: ExtractedIntent) {
  const { targetEntity, action, filters } = extractedJSON;
  const dateFilter = resolveDateRange(filters.dateRange?.start);

  switch (targetEntity) {
    case 'Attendance': {
      return await prisma.attendance.findMany({
        where: {
          date: dateFilter,
          ...(filters.threshold ? { percentage: { lt: filters.threshold } } : {}),
          ...(filters.courseName ? { course: { name: { contains: filters.courseName, mode: 'insensitive' } } } : {})
        },
        include: { student: { select: { firstName: true, lastName: true, id: true } } },
        orderBy: { date: 'desc' },
        take: filters.limit || 20
      });
    }

    case 'Payment': {
      return await prisma.payment.findMany({
        where: {
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.dateRange ? { dueDate: dateFilter } : {})
        },
        include: { student: { select: { firstName: true, lastName: true, course: true } } }
      });
    }

    case 'Student': {
      if (action === 'COUNT') {
        return await prisma.student.count({
          where: filters.courseName ? { course: { name: { contains: filters.courseName, mode: 'insensitive' } } } : {}
        });
      }
      return await prisma.student.findMany({
        where: filters.courseName ? { course: { name: { contains: filters.courseName, mode: 'insensitive' } } } : {},
        take: filters.limit || 50
      });
    }

    default:
      throw new Error(`Unsupported model entity: ${targetEntity}`);
  }
}
```

---

## 6. Safety & Security Guardrails

1. **Read-Only Scope Enforcement**: The extraction layer only permits `findMany`, `findUnique`, `count`, `aggregate`, and `groupBy`. Any mutation requests (`create`, `update`, `delete`) are strictly blocked.
2. **SQL Injection Prevention**: Using Prisma's native object syntax guarantees prepared statements and parameterized queries under the hood.
3. **Role-Based Tenant Scoping**: All Prisma queries automatically inject the logged-in user's institute tenant ID (`where: { instituteId: session.user.instituteId }`) to enforce strict data isolation.
