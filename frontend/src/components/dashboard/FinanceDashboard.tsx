'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Clock, AlertTriangle, Plus, X, Download, Printer, Search,
  CreditCard, Users, BookOpen, FileText, Upload,
  ArrowUpRight, ArrowDownRight, Eye, CheckCircle, XCircle,
} from 'lucide-react';
import { exportToCSV, generatePDFReport } from '../../utils/exportUtils';
import { Language } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// DATA MODEL
// All financial calculations use ONLY records with status === 'Confirmed'.
// Pending and Rejected records are tracked but never counted in totals.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Instructor payment arrangement — set when instructor is created.
 * Each instructor has an independent cycle based on their own start date.
 */
export interface InstructorPaymentArrangement {
  instructorId: string;
  instructorName: string;
  paymentAmount: number;        // ETB per month
  paymentFrequency: 'Monthly';
  paymentStartDate: string;     // YYYY-MM-DD
  firstPaymentDueDate: string;  // YYYY-MM-DD  (startDate + 1 month)
}

/**
 * A single instructor payment record.
 * Lifecycle: 'Pending' → 'Confirmed' (paid) | 'Cancelled'
 * Finance outgoing only counts status === 'Confirmed'.
 */
export interface InstructorPaymentRecord {
  id: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  periodLabel: string;          // e.g. "October 2026"
  paymentDate: string;          // YYYY-MM-DD (date admin initiated / confirmed)
  method: string;
  reference: string;
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;            // ISO timestamp — when admin created the record
  confirmedAt: string | null;   // ISO timestamp — when admin confirmed the transfer
  confirmedBy: string;          // admin name / id
}

/**
 * Derived view of each instructor's payment schedule.
 */
export interface InstructorPaymentSchedule {
  instructorId: string;
  instructorName: string;
  arrangement: InstructorPaymentArrangement;
  nextDueDate: string;
  lastPaidDate: string | null;
  lastPaidAmount: number | null;
  status: 'Upcoming' | 'Due Soon' | 'Due Today' | 'Overdue' | 'Paid';
  daysRemaining: number;        // negative = overdue
  history: InstructorPaymentRecord[];
}

/**
 * A student monthly payment record.
 * Lifecycle: 'Pending Verification' (student submitted) → 'Confirmed' | 'Rejected'
 * Finance income only counts status === 'Confirmed'.
 * 'Rejected' allows resubmission.
 */
export interface StudentMonthlyPayment {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  monthlyAmount: number;
  paymentMonth: string;         // "YYYY-MM"
  submittedDate: string | null; // YYYY-MM-DD — when student submitted
  paymentDate: string | null;   // YYYY-MM-DD — date on confirmed payment
  screenshotUrl: string;        // uploaded receipt / screenshot
  status: 'Pending Verification' | 'Confirmed' | 'Rejected' | 'Overdue';
  method: string;
  reference: string;
  notes: string;
  rejectionReason: string;
  confirmedAt: string | null;   // ISO timestamp
  confirmedBy: string;
}

/**
 * A confirmed income transaction.
 * Only Confirmed entries appear in Finance income totals.
 */
export interface IncomeEntry {
  id: string;
  type: 'Student Monthly Payment' | 'Registration Fee' | 'Other Income';
  description: string;
  amount: number;
  date: string;                 // YYYY-MM-DD
  method: string;
  reference: string;
  relatedPersonId: string;
  relatedPersonName: string;
  notes: string;
  status: 'Confirmed';          // Income ledger only ever holds confirmed entries
  confirmedAt: string;          // ISO timestamp
  confirmedBy: string;
  sourceId: string;             // ID of originating StudentMonthlyPayment or application
}

/**
 * A confirmed expense/payout transaction.
 * Only Confirmed entries appear in Finance outgoing totals.
 */
export interface ExpenseEntry {
  id: string;
  type: 'Instructor Payment' | 'Supplies' | 'Utilities' | 'Rent' | 'Marketing' | 'Other';
  description: string;
  amount: number;
  date: string;                 // YYYY-MM-DD
  method: string;
  recipient: string;
  reference: string;
  relatedInstructorId: string;
  notes: string;
  status: 'Confirmed';          // Expense ledger only ever holds confirmed entries
  confirmedAt: string;          // ISO timestamp
  confirmedBy: string;
  sourceId: string;             // ID of originating InstructorPaymentRecord
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function calcFirstPaymentDue(startDate: string): string {
  return addMonths(startDate, 1);
}

function daysFromToday(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due   = new Date(dateStr); due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function scheduleStatus(days: number): InstructorPaymentSchedule['status'] {
  if (days < 0)  return 'Overdue';
  if (days === 0) return 'Due Today';
  if (days <= 7)  return 'Due Soon';
  return 'Upcoming';
}

export function monthLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function fmt(n: number): string {
  return n.toLocaleString('en-US') + ' ETB';
}

function badge(status: string): string {
  const m: Record<string, string> = {
    'Upcoming':             'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    'Due Soon':             'bg-amber-400/15 text-amber-200 border border-amber-400/25',
    'Due Today':            'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    'Overdue':              'bg-red-500/15 text-red-300 border border-red-500/25',
    'Confirmed':            'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    'Pending':              'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    'Pending Verification': 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    'Rejected':             'bg-red-500/15 text-red-300 border border-red-500/25',
    'Cancelled':            'bg-zinc-500/15 text-zinc-400 border border-zinc-500/25',
    'Paid':                 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    'Overdue (student)':    'bg-red-500/15 text-red-300 border border-red-500/25',
  };
  return m[status] ?? 'bg-white/10 text-white/60 border border-white/10';
}

const PAYMENT_METHODS = ['Cash', 'Telebirr', 'Bank Transfer', 'CBE Birr', 'Awash Bank', 'Dashen Bank', 'Other'];
const NOW_ISO = () => new Date().toISOString();
const TODAY   = () => new Date().toISOString().slice(0, 10);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FinanceDashboardProps {
  currentLang?: Language;
  currentUserName?: string;
  /** All instructors from AdminDashboard state */
  instructors: Array<{ id: string; name: string; subjects: string[]; status: string }>;
  /** All students from AdminDashboard state */
  students: Array<{ id: string; name: string; course: string; duration: string; status: string; regDate: string }>;
  /** One arrangement per instructor (set at instructor creation) */
  instructorArrangements: InstructorPaymentArrangement[];
  /** Derived payment schedules (passed in, computed in AdminDashboard) */
  instructorPaymentSchedules: InstructorPaymentSchedule[];
  /** All instructor payment records (pending + confirmed + cancelled) */
  instructorPaymentRecords: InstructorPaymentRecord[];
  /** Create a new pending instructor payment record */
  onCreateInstructorPayment: (record: InstructorPaymentRecord) => void;
  /** Confirm an existing pending instructor payment → logs to expenses */
  onConfirmInstructorPayment: (recordId: string, confirmedBy: string) => void;
  /** Cancel a pending instructor payment */
  onCancelInstructorPayment: (recordId: string) => void;
  /** All student monthly payment records */
  studentMonthlyPayments: StudentMonthlyPayment[];
  /** Admin creates a payment slot for a student */
  onCreateStudentPayment: (p: StudentMonthlyPayment) => void;
  /** Admin approves a 'Pending Verification' student payment → logs to income */
  onApproveStudentPayment: (id: string, confirmedBy: string, paymentDate: string, method: string, reference: string, notes: string) => void;
  /** Admin rejects a student payment */
  onRejectStudentPayment: (id: string, reason: string, confirmedBy: string) => void;
  /** All confirmed income entries (source of truth for income totals) */
  incomeEntries: IncomeEntry[];
  /** Add a manual income entry */
  onAddIncome: (e: IncomeEntry) => void;
  /** All confirmed expense entries (source of truth for outgoing totals) */
  expenseEntries: ExpenseEntry[];
  /** Add a manual expense entry */
  onAddExpense: (e: ExpenseEntry) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FinanceTab = 'overview' | 'instructor-payments' | 'student-payments' | 'income' | 'expenses' | 'reports';

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  currentLang = 'en',
  currentUserName = 'Admin',
  instructors,
  students,
  instructorArrangements,
  instructorPaymentSchedules,
  instructorPaymentRecords,
  onCreateInstructorPayment,
  onConfirmInstructorPayment,
  onCancelInstructorPayment,
  studentMonthlyPayments,
  onCreateStudentPayment,
  onApproveStudentPayment,
  onRejectStudentPayment,
  incomeEntries,
  onAddIncome,
  expenseEntries,
  onAddExpense,
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');

  // ── Create instructor payment modal ───────────────────────────────────────
  const [createPayModal, setCreatePayModal] = useState<string | null>(null); // instructorId
  const [createPayForm, setCreatePayForm] = useState({
    amount: '', paymentDate: TODAY(), method: 'Cash', reference: '', notes: '',
  });

  // ── Confirm instructor payment modal ─────────────────────────────────────
  const [confirmPayModal, setConfirmPayModal] = useState<InstructorPaymentRecord | null>(null);

  // ── View instructor history ────────────────────────────────────────────────
  const [viewHistoryId, setViewHistoryId] = useState<string | null>(null);

  // ── Student payment create modal ──────────────────────────────────────────
  const [createStudentPayModal, setCreateStudentPayModal] = useState(false);
  const [createStudentPayForm, setCreateStudentPayForm] = useState({
    studentId: '', monthlyAmount: '', paymentMonth: new Date().toISOString().slice(0, 7),
  });

  // ── Student payment approve/reject modal ──────────────────────────────────
  const [reviewStudentPayModal, setReviewStudentPayModal] = useState<StudentMonthlyPayment | null>(null);
  const [approveForm, setApproveForm] = useState({
    paymentDate: TODAY(), method: 'Cash', reference: '', notes: '',
  });
  const [rejectForm, setRejectForm] = useState({ reason: '' });
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  // ── Manual income modal ────────────────────────────────────────────────────
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    type: 'Other Income' as IncomeEntry['type'],
    description: '', amount: '', date: TODAY(),
    method: 'Cash', reference: '', relatedPersonName: '', notes: '',
  });

  // ── Manual expense modal ───────────────────────────────────────────────────
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    type: 'Other' as ExpenseEntry['type'],
    description: '', amount: '', date: TODAY(),
    method: 'Cash', recipient: '', reference: '',
    relatedInstructorId: '', notes: '',
  });

  // ── Report filters ─────────────────────────────────────────────────────────
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState<number | 'all'>('all');
  const [reportType, setReportType] = useState<'all' | 'income' | 'expense'>('all');
  const [reportStudentFilter, setReportStudentFilter] = useState('');
  const [reportInstructorFilter, setReportInstructorFilter] = useState('');

  // ── Student payments filter ────────────────────────────────────────────────
  const [spSearch, setSpSearch] = useState('');
  const [spStatus, setSpStatus] = useState<string>('all');

  // ── Instructor payments filter ────────────────────────────────────────────
  const [ipFilter, setIpFilter] = useState<string>('all');

  // ─── Core computed totals (CONFIRMED only) ───────────────────────────────

  const todayStr   = TODAY();
  const thisMonth  = todayStr.slice(0, 7);
  const thisYear   = todayStr.slice(0, 4);

  const totals = useMemo(() => {
    // Income — ALL entries in incomeEntries are already Confirmed (ledger rule)
    const totalIncome    = incomeEntries.reduce((s, e) => s + e.amount, 0);
    const incomeThisMonth  = incomeEntries.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
    const incomeThisYear   = incomeEntries.filter(e => e.date.startsWith(thisYear)).reduce((s, e) => s + e.amount, 0);
    const studentIncomeThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Student Monthly Payment')
      .reduce((s, e) => s + e.amount, 0);
    const regFeeThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Registration Fee')
      .reduce((s, e) => s + e.amount, 0);
    const otherIncomeThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Other Income')
      .reduce((s, e) => s + e.amount, 0);

    // Expenses — ALL entries in expenseEntries are already Confirmed (ledger rule)
    const totalExpenses  = expenseEntries.reduce((s, e) => s + e.amount, 0);
    const instrPayThisMonth = expenseEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Instructor Payment')
      .reduce((s, e) => s + e.amount, 0);
    const otherExpThisMonth = expenseEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type !== 'Instructor Payment')
      .reduce((s, e) => s + e.amount, 0);
    const totalExpThisMonth = instrPayThisMonth + otherExpThisMonth;

    const netBalance = totalIncome - totalExpenses;

    // Outstanding — student payments not yet confirmed
    const pendingStudentCount    = studentMonthlyPayments.filter(p => p.status === 'Pending Verification').length;
    const overdueStudentCount    = studentMonthlyPayments.filter(p => p.status === 'Overdue').length;
    const rejectedStudentCount   = studentMonthlyPayments.filter(p => p.status === 'Rejected').length;
    const pendingStudentAmount   = studentMonthlyPayments
      .filter(p => p.status !== 'Confirmed').reduce((s, p) => s + p.monthlyAmount, 0);

    // Pending instructor payments (created but not confirmed)
    const pendingInstrCount  = instructorPaymentRecords.filter(r => r.status === 'Pending').length;
    const overdueInstrCount  = instructorPaymentSchedules.filter(s => s.status === 'Overdue').length;
    const dueTodayInstrCount = instructorPaymentSchedules.filter(s => s.status === 'Due Today').length;
    const dueSoonInstrCount  = instructorPaymentSchedules.filter(s => s.status === 'Due Soon').length;

    return {
      totalIncome, incomeThisMonth, incomeThisYear,
      studentIncomeThisMonth, regFeeThisMonth, otherIncomeThisMonth,
      totalExpenses, instrPayThisMonth, otherExpThisMonth, totalExpThisMonth,
      netBalance,
      pendingStudentCount, overdueStudentCount, rejectedStudentCount, pendingStudentAmount,
      pendingInstrCount, overdueInstrCount, dueTodayInstrCount, dueSoonInstrCount,
    };
  }, [incomeEntries, expenseEntries, studentMonthlyPayments, instructorPaymentRecords, instructorPaymentSchedules, thisMonth, thisYear]);

  // ─── Alerts ───────────────────────────────────────────────────────────────

  const alerts = useMemo(() => {
    const list: { id: string; level: 'error' | 'warn' | 'info'; msg: string }[] = [];
    instructorPaymentSchedules.forEach(s => {
      if (s.status === 'Overdue')   list.push({ id: `${s.instructorId}-ov`, level: 'error', msg: `Instructor payment OVERDUE: ${s.instructorName} — ${fmt(s.arrangement.paymentAmount)}` });
      else if (s.status === 'Due Today') list.push({ id: `${s.instructorId}-td`, level: 'warn',  msg: `Instructor payment DUE TODAY: ${s.instructorName} — ${fmt(s.arrangement.paymentAmount)}` });
      else if (s.status === 'Due Soon')  list.push({ id: `${s.instructorId}-ds`, level: 'info',  msg: `Instructor payment due in ${s.daysRemaining} day${s.daysRemaining === 1 ? '' : 's'}: ${s.instructorName} — ${fmt(s.arrangement.paymentAmount)}` });
    });
    if (totals.pendingStudentCount > 0)
      list.push({ id: 'sp-pending', level: 'info', msg: `${totals.pendingStudentCount} student payment${totals.pendingStudentCount > 1 ? 's' : ''} awaiting verification` });
    if (totals.pendingInstrCount > 0)
      list.push({ id: 'ip-pending', level: 'warn', msg: `${totals.pendingInstrCount} instructor payment${totals.pendingInstrCount > 1 ? 's' : ''} pending confirmation` });
    return list;
  }, [instructorPaymentSchedules, totals]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleCreateInstructorPayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!createPayModal) return;
    const sched = instructorPaymentSchedules.find(s => s.instructorId === createPayModal);
    if (!sched) return;
    const amount = parseFloat(createPayForm.amount) || sched.arrangement.paymentAmount;
    const record: InstructorPaymentRecord = {
      id: `IPAY-${Date.now()}`,
      instructorId: createPayModal,
      instructorName: sched.instructorName,
      amount,
      periodLabel: monthLabel(sched.nextDueDate),
      paymentDate: createPayForm.paymentDate,
      method: createPayForm.method,
      reference: createPayForm.reference,
      notes: createPayForm.notes,
      status: 'Pending',
      createdAt: NOW_ISO(),
      confirmedAt: null,
      confirmedBy: '',
    };
    onCreateInstructorPayment(record);
    setCreatePayModal(null);
    setCreatePayForm({ amount: '', paymentDate: TODAY(), method: 'Cash', reference: '', notes: '' });
  }, [createPayModal, createPayForm, instructorPaymentSchedules, onCreateInstructorPayment]);

  const handleConfirmInstructorPayment = useCallback(() => {
    if (!confirmPayModal) return;
    onConfirmInstructorPayment(confirmPayModal.id, currentUserName);
    setConfirmPayModal(null);
  }, [confirmPayModal, onConfirmInstructorPayment, currentUserName]);

  const handleApproveStudentPayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewStudentPayModal) return;
    onApproveStudentPayment(
      reviewStudentPayModal.id, currentUserName,
      approveForm.paymentDate, approveForm.method,
      approveForm.reference, approveForm.notes,
    );
    setReviewStudentPayModal(null);
    setReviewAction(null);
  }, [reviewStudentPayModal, approveForm, onApproveStudentPayment, currentUserName]);

  const handleRejectStudentPayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewStudentPayModal) return;
    onRejectStudentPayment(reviewStudentPayModal.id, rejectForm.reason, currentUserName);
    setReviewStudentPayModal(null);
    setReviewAction(null);
  }, [reviewStudentPayModal, rejectForm, onRejectStudentPayment, currentUserName]);

  const handleCreateStudentPayment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === createStudentPayForm.studentId);
    if (!student) return;
    const p: StudentMonthlyPayment = {
      id: `SPAY-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      program: student.course,
      monthlyAmount: parseFloat(createStudentPayForm.monthlyAmount) || 0,
      paymentMonth: createStudentPayForm.paymentMonth,
      submittedDate: null,
      paymentDate: null,
      screenshotUrl: '',
      status: 'Pending Verification',
      method: '',
      reference: '',
      notes: '',
      rejectionReason: '',
      confirmedAt: null,
      confirmedBy: '',
    };
    onCreateStudentPayment(p);
    setCreateStudentPayModal(false);
    setCreateStudentPayForm({ studentId: '', monthlyAmount: '', paymentMonth: new Date().toISOString().slice(0, 7) });
  }, [createStudentPayForm, students, onCreateStudentPayment]);

  const handleAddIncomeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAddIncome({
      id: `INC-${Date.now()}`,
      type: incomeForm.type,
      description: incomeForm.description,
      amount: parseFloat(incomeForm.amount) || 0,
      date: incomeForm.date,
      method: incomeForm.method,
      reference: incomeForm.reference,
      relatedPersonId: '',
      relatedPersonName: incomeForm.relatedPersonName,
      notes: incomeForm.notes,
      status: 'Confirmed',
      confirmedAt: NOW_ISO(),
      confirmedBy: currentUserName,
      sourceId: `MANUAL-${Date.now()}`,
    });
    setIncomeModalOpen(false);
    setIncomeForm({ type: 'Other Income', description: '', amount: '', date: TODAY(), method: 'Cash', reference: '', relatedPersonName: '', notes: '' });
  }, [incomeForm, onAddIncome, currentUserName]);

  const handleAddExpenseSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      id: `EXP-${Date.now()}`,
      type: expenseForm.type,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount) || 0,
      date: expenseForm.date,
      method: expenseForm.method,
      recipient: expenseForm.recipient,
      reference: expenseForm.reference,
      relatedInstructorId: expenseForm.relatedInstructorId,
      notes: expenseForm.notes,
      status: 'Confirmed',
      confirmedAt: NOW_ISO(),
      confirmedBy: currentUserName,
      sourceId: `MANUAL-${Date.now()}`,
    });
    setExpenseModalOpen(false);
    setExpenseForm({ type: 'Other', description: '', amount: '', date: TODAY(), method: 'Cash', recipient: '', reference: '', relatedInstructorId: '', notes: '' });
  }, [expenseForm, onAddExpense, currentUserName]);

  // ─── Shared styles ────────────────────────────────────────────────────────
  const FC = 'w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none focus:border-[#E9C349] transition-all';
  const LC = 'block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]';

  // ─── Tab nav ──────────────────────────────────────────────────────────────
  type TabDef = { id: FinanceTab; label: string; icon: React.ReactNode; alertCount?: number };
  const tabs: TabDef[] = [
    { id: 'overview',            label: 'Overview',            icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'instructor-payments', label: 'Instructor Payments', icon: <Users className="w-3.5 h-3.5" />,  alertCount: totals.pendingInstrCount + totals.overdueInstrCount },
    { id: 'student-payments',    label: 'Student Payments',    icon: <BookOpen className="w-3.5 h-3.5" />, alertCount: totals.pendingStudentCount },
    { id: 'income',              label: 'Income',              icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'expenses',            label: 'Expenses',            icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { id: 'reports',             label: 'Reports',             icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5 font-sans">

      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] text-[10px] font-mono font-bold border border-[#E9C349]/30 flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" /> Finance
          </span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">CONFIRMED TRANSACTIONS ONLY</span>
        </div>
        <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Finance Management</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Instructor payments, student fees, income, expenses, and financial reports. All totals reflect confirmed transactions only.</p>
      </div>

      {/* Alert banners */}
      {alerts.length > 0 && (
        <div className="space-y-1.5">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border ${
              a.level === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
              a.level === 'warn'  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                                    'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
              {a.level === 'error' ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> :
               a.level === 'warn'  ? <AlertCircle   className="w-3.5 h-3.5 shrink-0" /> :
                                     <Clock         className="w-3.5 h-3.5 shrink-0" />}
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab nav */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
              ${activeTab === t.id ? 'bg-[#E9C349] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'}`}>
            {t.icon}{t.label}
            {!!t.alertCount && t.alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{t.alertCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERVIEW
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Income row */}
          <section>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Confirmed Income
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Income This Month',          v: fmt(totals.incomeThisMonth),        c: 'text-emerald-400', b: 'border-emerald-500/30' },
                { label: 'Income This Year',            v: fmt(totals.incomeThisYear),          c: 'text-emerald-300', b: 'border-emerald-500/20' },
                { label: 'Student Payments This Month', v: fmt(totals.studentIncomeThisMonth), c: 'text-blue-400',    b: 'border-blue-500/30' },
                { label: 'Registration Fees This Month',v: fmt(totals.regFeeThisMonth),        c: 'text-[#E9C349]',   b: 'border-[#E9C349]/30' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.b} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-lg font-mono font-bold ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Outgoing row */}
          <section>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> Confirmed Outgoing
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Instructor Payments This Month', v: fmt(totals.instrPayThisMonth),    c: 'text-amber-400', b: 'border-amber-500/30' },
                { label: 'Other Expenses This Month',      v: fmt(totals.otherExpThisMonth),    c: 'text-red-400',   b: 'border-red-500/30' },
                { label: 'Total Outgoing This Month',      v: fmt(totals.totalExpThisMonth),    c: 'text-red-300',   b: 'border-red-500/20' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.b} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-lg font-mono font-bold ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Net balance */}
          <section>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#E9C349]" /> Net Balance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Confirmed Income',   v: fmt(totals.totalIncome),   c: 'text-emerald-400', b: 'border-emerald-500/30' },
                { label: 'Total Confirmed Outgoing', v: fmt(totals.totalExpenses), c: 'text-red-400',     b: 'border-red-500/30' },
                { label: 'Net / Remaining Finance',  v: fmt(totals.netBalance),    c: totals.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400', b: totals.netBalance >= 0 ? 'border-emerald-500/30' : 'border-red-500/30' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.b} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-xl font-mono font-bold ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-2 font-mono">
              NET = Confirmed Income − Confirmed Outgoing. Pending or Rejected payments are NOT included.
            </p>
          </section>

          {/* Outstanding counters */}
          <section>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Outstanding / Pending</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { label: 'Awaiting Verification', v: totals.pendingStudentCount,  c: 'text-blue-400' },
                { label: 'Overdue Students',       v: totals.overdueStudentCount,  c: 'text-red-400' },
                { label: 'Rejected Submissions',   v: totals.rejectedStudentCount, c: 'text-red-400' },
                { label: 'Pending Instr. Pmts',    v: totals.pendingInstrCount,    c: 'text-amber-400' },
                { label: 'Due Today (Instr.)',      v: totals.dueTodayInstrCount,  c: 'text-amber-400' },
                { label: 'Overdue Instructors',    v: totals.overdueInstrCount,    c: 'text-red-400' },
              ].map(c => (
                <div key={c.label} className="p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-0.5">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-2xl font-mono font-bold ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          INSTRUCTOR PAYMENTS
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'instructor-payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Instructor Payment Schedules</h3>
              <p className="text-xs text-[var(--text-secondary)]">Each instructor has an independent cycle. Payment only counts as outgoing after Admin confirms the transfer.</p>
            </div>
            <select value={ipFilter} onChange={e => setIpFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none shrink-0">
              <option value="all">All Instructors</option>
              <option value="Overdue">Overdue</option>
              <option value="Due Today">Due Today</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          {/* Pending confirmation records */}
          {instructorPaymentRecords.filter(r => r.status === 'Pending').length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/8 border border-amber-500/25 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Payments Awaiting Confirmation
              </h4>
              <div className="space-y-2">
                {instructorPaymentRecords.filter(r => r.status === 'Pending').map(r => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg-panel)] border border-amber-500/20">
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">{r.instructorName}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono">{r.periodLabel} · {fmt(r.amount)} · {r.method}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Created {new Date(r.createdAt).toLocaleDateString()} · Ref: {r.reference || '—'}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setConfirmPayModal(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirm Transfer
                      </button>
                      <button onClick={() => onCancelInstructorPayment(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 text-xs font-bold hover:bg-red-500/25 transition-all">
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule cards */}
          {instructorPaymentSchedules.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] text-sm">
              No instructor payment arrangements yet.<br />
              <span className="text-xs">Add payment details when registering a new instructor.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {instructorPaymentSchedules
                .filter(s => ipFilter === 'all' || s.status === ipFilter)
                .map(sched => {
                  const isViewing = viewHistoryId === sched.instructorId;
                  const days = sched.daysRemaining;
                  const daysLabel = days < 0
                    ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
                    : days === 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} remaining`;
                  const hasPending = instructorPaymentRecords.some(r => r.instructorId === sched.instructorId && r.status === 'Pending');

                  return (
                    <div key={sched.instructorId} className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] overflow-hidden">
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Identity */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E9C349]/15 border border-[#E9C349]/25 flex items-center justify-center text-[#E9C349] font-bold text-sm font-serif shrink-0">
                            {sched.instructorName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[var(--text-primary)]">{sched.instructorName}</div>
                            <div className="text-[11px] text-[var(--text-secondary)] font-mono">{sched.instructorId}</div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div><div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Monthly</div><div className="font-mono font-bold text-[var(--text-primary)]">{fmt(sched.arrangement.paymentAmount)}</div></div>
                          <div><div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Period</div><div className="font-mono font-bold text-[var(--text-primary)]">{monthLabel(sched.nextDueDate)}</div></div>
                          <div><div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Last Paid</div><div className="font-mono text-[var(--text-secondary)]">{sched.lastPaidDate ?? '—'}</div></div>
                          <div><div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Next Due</div><div className="font-mono font-bold text-[var(--text-primary)]">{sched.nextDueDate}</div></div>
                          <div>
                            <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Days</div>
                            <div className={`font-mono font-bold text-xs ${days < 0 ? 'text-red-400' : days === 0 ? 'text-amber-400' : days <= 7 ? 'text-amber-300' : 'text-emerald-400'}`}>{daysLabel}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${badge(sched.status)}`}>{sched.status}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setViewHistoryId(isViewing ? null : sched.instructorId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all">
                            <Eye className="w-3.5 h-3.5" /> History
                          </button>
                          {!hasPending && (
                            <button
                              onClick={() => { setCreatePayModal(sched.instructorId); setCreatePayForm(f => ({ ...f, amount: String(sched.arrangement.paymentAmount) })); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9C349] text-black text-xs font-bold hover:brightness-110 transition-all">
                              <CreditCard className="w-3.5 h-3.5" /> Pay Instructor
                            </button>
                          )}
                          {hasPending && (
                            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/25">Awaiting Confirmation</span>
                          )}
                        </div>
                      </div>

                      {/* History panel */}
                      {isViewing && (
                        <div className="border-t border-[var(--border-default)] p-4 bg-[var(--bg-glass)]">
                          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Payment History</h4>
                          {sched.history.length === 0 ? (
                            <p className="text-xs text-[var(--text-muted)]">No payments recorded yet.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-subtle)]">
                                    <th className="py-2 px-2 text-left">Period</th>
                                    <th className="py-2 px-2 text-left">Amount</th>
                                    <th className="py-2 px-2 text-left">Date</th>
                                    <th className="py-2 px-2 text-left">Method</th>
                                    <th className="py-2 px-2 text-left">Reference</th>
                                    <th className="py-2 px-2 text-left">Status</th>
                                    <th className="py-2 px-2 text-left">Confirmed</th>
                                    <th className="py-2 px-2 text-left">Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                  {sched.history.map(h => (
                                    <tr key={h.id} className="hover:bg-[var(--bg-panel)] transition-colors">
                                      <td className="py-2 px-2 text-[var(--text-secondary)]">{h.periodLabel}</td>
                                      <td className="py-2 px-2 font-mono font-bold text-emerald-400">{fmt(h.amount)}</td>
                                      <td className="py-2 px-2 font-mono text-[var(--text-primary)]">{h.paymentDate}</td>
                                      <td className="py-2 px-2 text-[var(--text-secondary)]">{h.method}</td>
                                      <td className="py-2 px-2 font-mono text-[var(--text-muted)]">{h.reference || '—'}</td>
                                      <td className="py-2 px-2"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badge(h.status)}`}>{h.status}</span></td>
                                      <td className="py-2 px-2 font-mono text-[var(--text-muted)] text-[10px]">{h.confirmedAt ? new Date(h.confirmedAt).toLocaleDateString() : '—'}</td>
                                      <td className="py-2 px-2 text-[var(--text-muted)] max-w-[120px] truncate">{h.notes || '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STUDENT MONTHLY PAYMENTS
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'student-payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Student Monthly Payments</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Only Admin-approved payments count as confirmed income. Pending and Rejected submissions are never counted.
              </p>
            </div>
            <button onClick={() => setCreateStudentPayModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E9C349] text-black text-xs font-bold hover:brightness-110 transition-all shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add Payment Record
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-40">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input value={spSearch} onChange={e => setSpSearch(e.target.value)}
                placeholder="Search student…"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349]" />
            </div>
            <select value={spStatus} onChange={e => setSpStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
              <option value="all">All Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Program</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Month</th>
                  <th className="py-3 px-4 text-left">Submitted</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {studentMonthlyPayments
                  .filter(p => {
                    const matchSearch = !spSearch || p.studentName.toLowerCase().includes(spSearch.toLowerCase()) || p.studentId.toLowerCase().includes(spSearch.toLowerCase());
                    const matchStatus = spStatus === 'all' || p.status === spStatus;
                    return matchSearch && matchStatus;
                  })
                  .map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{p.studentName}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)] text-[10px]">{p.studentId}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[140px] truncate">{p.program}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--text-primary)]">{fmt(p.monthlyAmount)}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{p.paymentMonth}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{p.submittedDate ?? '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${badge(p.status)}`}>{p.status}</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{p.method || '—'}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{p.reference || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.status === 'Pending Verification' && (
                            <button
                              onClick={() => { setReviewStudentPayModal(p); setReviewAction(null); setApproveForm(f => ({...f, paymentDate: TODAY()})); }}
                              className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/25 text-[10px] font-bold hover:bg-blue-500/25 transition-all">
                              Review
                            </button>
                          )}
                          {p.status === 'Rejected' && (
                            <span className="px-2 py-0.5 rounded-xl bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                              Can resubmit
                            </span>
                          )}
                          {p.status === 'Confirmed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {studentMonthlyPayments.length === 0 && (
                  <tr><td colSpan={10} className="py-12 text-center text-[var(--text-muted)] text-xs">No student payment records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          INCOME LEDGER
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Confirmed Income Ledger</h3>
              <p className="text-xs text-[var(--text-secondary)]">All entries here are confirmed transactions. Pending or rejected payments never appear in this ledger.</p>
            </div>
            <button onClick={() => setIncomeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add Income
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Person</th>
                  <th className="py-3 px-4 text-left">Confirmed By</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {incomeEntries.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-[var(--text-muted)] text-xs">No confirmed income yet. Approve student payments or add manual income entries.</td></tr>
                )}
                {[...incomeEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                  <tr key={e.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                    <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{e.date}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">{e.type}</span></td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[180px] truncate">{e.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-right">{fmt(e.amount)}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{e.method}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{e.reference || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{e.relatedPersonName || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] text-[10px]">{e.confirmedBy}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] max-w-[140px] truncate">{e.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
              {incomeEntries.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                    <td colSpan={3} className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total Confirmed Income</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm text-right">{fmt(incomeEntries.reduce((s, e) => s + e.amount, 0))}</td>
                    <td colSpan={5} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <button onClick={() => exportToCSV('Dare_Income_Ledger', ['Date','Type','Description','Amount','Method','Reference','Person','Confirmed By','Notes'], incomeEntries.map(e => [e.date, e.type, e.description, e.amount, e.method, e.reference, e.relatedPersonName, e.confirmedBy, e.notes]))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700/20 text-emerald-400 border border-emerald-500/25 text-xs font-bold hover:bg-emerald-700/30 transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EXPENSES / PAYOUTS
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Confirmed Expenses & Payouts</h3>
              <p className="text-xs text-[var(--text-secondary)]">Only confirmed outgoing transactions. Instructor payments appear here automatically after Admin confirms the transfer.</p>
            </div>
            <button onClick={() => setExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add Expense
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Recipient</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Confirmed By</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {expenseEntries.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-[var(--text-muted)] text-xs">No confirmed expenses yet. Instructor payments appear here after confirmation.</td></tr>
                )}
                {[...expenseEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                  <tr key={e.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                    <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{e.date}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${e.type === 'Instructor Payment' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-red-500/15 text-red-300 border-red-500/25'}`}>{e.type}</span></td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[180px] truncate">{e.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400 text-right">{fmt(e.amount)}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{e.method}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{e.recipient || '—'}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{e.reference || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] text-[10px]">{e.confirmedBy}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] max-w-[140px] truncate">{e.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
              {expenseEntries.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                    <td colSpan={3} className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total Confirmed Outgoing</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400 text-sm text-right">{fmt(expenseEntries.reduce((s, e) => s + e.amount, 0))}</td>
                    <td colSpan={5} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <button onClick={() => exportToCSV('Dare_Expenses_Ledger', ['Date','Type','Description','Amount','Method','Recipient','Reference','Confirmed By','Notes'], expenseEntries.map(e => [e.date, e.type, e.description, e.amount, e.method, e.recipient, e.reference, e.confirmedBy, e.notes]))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 text-xs font-bold hover:bg-red-500/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          REPORTS & ANALYTICS
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'reports' && (() => {
        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const allYears = Array.from(new Set([
          ...incomeEntries.map(e => parseInt(e.date.slice(0,4))),
          ...expenseEntries.map(e => parseInt(e.date.slice(0,4))),
          new Date().getFullYear(),
        ])).sort((a,b) => b-a);
        const yrStr = String(reportYear);

        const fIncome = incomeEntries.filter(e => {
          const yr = e.date.startsWith(yrStr);
          const mo = reportMonth === 'all' || e.date.startsWith(`${yrStr}-${String((reportMonth as number)+1).padStart(2,'0')}`);
          const sp = !reportStudentFilter || e.relatedPersonName.toLowerCase().includes(reportStudentFilter.toLowerCase());
          const tp = reportType === 'all' || reportType === 'income';
          return yr && mo && sp && tp;
        });
        const fExpense = expenseEntries.filter(e => {
          const yr = e.date.startsWith(yrStr);
          const mo = reportMonth === 'all' || e.date.startsWith(`${yrStr}-${String((reportMonth as number)+1).padStart(2,'0')}`);
          const ip = !reportInstructorFilter || e.recipient.toLowerCase().includes(reportInstructorFilter.toLowerCase());
          const tp = reportType === 'all' || reportType === 'expense';
          return yr && mo && ip && tp;
        });

        const yIncome      = fIncome.reduce((s,e) => s+e.amount,0);
        const yStudentPay  = fIncome.filter(e=>e.type==='Student Monthly Payment').reduce((s,e)=>s+e.amount,0);
        const yRegFee      = fIncome.filter(e=>e.type==='Registration Fee').reduce((s,e)=>s+e.amount,0);
        const yOtherInc    = fIncome.filter(e=>e.type==='Other Income').reduce((s,e)=>s+e.amount,0);
        const yInstrPay    = fExpense.filter(e=>e.type==='Instructor Payment').reduce((s,e)=>s+e.amount,0);
        const yOtherExp    = fExpense.filter(e=>e.type!=='Instructor Payment').reduce((s,e)=>s+e.amount,0);
        const yPayout      = fExpense.reduce((s,e)=>s+e.amount,0);
        const yNet         = yIncome - yPayout;

        const outstandingStudent = studentMonthlyPayments
          .filter(p=>p.paymentMonth.startsWith(yrStr) && p.status !== 'Confirmed')
          .reduce((s,p)=>s+p.monthlyAmount,0);
        const outstandingInstr = instructorPaymentSchedules
          .filter(s=>s.status==='Overdue'||s.status==='Due Today'||s.status==='Due Soon')
          .reduce((s,sch)=>s+sch.arrangement.paymentAmount,0);

        const monthRows = MONTHS.map((mName,mi) => {
          const mStr = `${yrStr}-${String(mi+1).padStart(2,'0')}`;
          const inc  = incomeEntries.filter(e=>e.date.startsWith(mStr)).reduce((s,e)=>s+e.amount,0);
          const iP   = expenseEntries.filter(e=>e.date.startsWith(mStr)&&e.type==='Instructor Payment').reduce((s,e)=>s+e.amount,0);
          const oE   = expenseEntries.filter(e=>e.date.startsWith(mStr)&&e.type!=='Instructor Payment').reduce((s,e)=>s+e.amount,0);
          const tot  = iP+oE;
          return { month: mName, inc, iP, oE, tot, net: inc-tot };
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
              <div>
                <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Financial Reports — {reportYear}</h3>
                <p className="text-xs text-[var(--text-secondary)]">Based on confirmed transactions only. Select year/month/filters to drill down.</p>
              </div>
              <button
                onClick={() => generatePDFReport(
                  `Dare Institute Financial Report — ${reportYear}`,
                  `Annual financial summary (confirmed transactions only)`,
                  ['Month','Income','Instructor Payout','Other Expenses','Total Outgoing','Net Income'],
                  monthRows.map(r=>[r.month,fmt(r.inc),fmt(r.iP),fmt(r.oE),fmt(r.tot),fmt(r.net)]),
                  [{label:'Total Income',value:fmt(yIncome)},{label:'Total Outgoing',value:fmt(yPayout)},{label:'Net Income',value:fmt(yNet)}]
                )}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold transition-all shrink-0">
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
              <select value={reportYear} onChange={e=>setReportYear(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                {allYears.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <select value={reportMonth==='all'?'all':String(reportMonth)} onChange={e=>setReportMonth(e.target.value==='all'?'all':Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                <option value="all">All Months</option>
                {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
              </select>
              <select value={reportType} onChange={e=>setReportType(e.target.value as typeof reportType)}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                <option value="all">Income + Expenses</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
              <input value={reportStudentFilter} onChange={e=>setReportStudentFilter(e.target.value)}
                placeholder="Filter by student…"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349] min-w-36" />
              <input value={reportInstructorFilter} onChange={e=>setReportInstructorFilter(e.target.value)}
                placeholder="Filter by instructor…"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349] min-w-36" />
            </div>

            {/* Yearly summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {label:'Total Income',                 v:fmt(yIncome),         c:'text-emerald-400', b:'border-emerald-500/30'},
                {label:'Student Monthly Payments',      v:fmt(yStudentPay),     c:'text-blue-400',    b:'border-blue-500/30'},
                {label:'Registration Fees',             v:fmt(yRegFee),         c:'text-[#E9C349]',   b:'border-[#E9C349]/30'},
                {label:'Other Income',                  v:fmt(yOtherInc),       c:'text-emerald-300', b:'border-emerald-500/20'},
                {label:'Total Instructor Payments',     v:fmt(yInstrPay),       c:'text-amber-400',   b:'border-amber-500/30'},
                {label:'Other Expenses',                v:fmt(yOtherExp),       c:'text-red-400',     b:'border-red-500/30'},
                {label:'Total Outgoing',                v:fmt(yPayout),         c:'text-red-300',     b:'border-red-500/20'},
                {label:'Net / Remaining Income',        v:fmt(yNet),            c:yNet>=0?'text-emerald-400':'text-red-400', b:yNet>=0?'border-emerald-500/30':'border-red-500/30'},
                {label:'Outstanding Student Pmts',      v:fmt(outstandingStudent), c:'text-amber-400', b:'border-amber-500/30'},
                {label:'Outstanding Instructor Pmts',   v:fmt(outstandingInstr),   c:'text-red-400',   b:'border-red-500/30'},
              ].map(c=>(
                <div key={c.label} className={`p-3 rounded-2xl bg-[var(--bg-panel)] border ${c.b} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-base font-mono font-bold ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>

            {/* Monthly breakdown */}
            <div>
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">Monthly Breakdown — {reportYear}</h4>
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                      <th className="py-3 px-4 text-left">Month</th>
                      <th className="py-3 px-4 text-right">Income</th>
                      <th className="py-3 px-4 text-right">Instructor Payout</th>
                      <th className="py-3 px-4 text-right">Other Expenses</th>
                      <th className="py-3 px-4 text-right">Total Outgoing</th>
                      <th className="py-3 px-4 text-right">Net Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {monthRows.map(r=>(
                      <tr key={r.month} className="hover:bg-[var(--bg-glass)] transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">{r.month}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{r.inc>0?fmt(r.inc):'—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-amber-400">{r.iP>0?fmt(r.iP):'—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-400">{r.oE>0?fmt(r.oE):'—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-300">{r.tot>0?fmt(r.tot):'—'}</td>
                        <td className={`py-2.5 px-4 text-right font-mono font-bold ${r.net>=0?'text-emerald-400':'text-red-400'}`}>{r.inc===0&&r.tot===0?'—':fmt(r.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{fmt(yIncome)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{fmt(yInstrPay)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-400">{fmt(yOtherExp)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-300">{fmt(yPayout)}</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold text-sm ${yNet>=0?'text-emerald-400':'text-red-400'}`}>{fmt(yNet)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Export */}
            <div className="flex gap-2">
              <button onClick={()=>exportToCSV(`Dare_Finance_${reportYear}`,['Month','Income','Instructor Payout','Other Expenses','Total Outgoing','Net Income'],monthRows.map(r=>[r.month,r.inc,r.iP,r.oE,r.tot,r.net]))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9C349]/15 text-[#E9C349] border border-[#E9C349]/30 text-xs font-bold hover:bg-[#E9C349]/20 transition-all">
                <Download className="w-3.5 h-3.5" /> Monthly CSV
              </button>
              <button onClick={()=>exportToCSV(`Dare_Transactions_${reportYear}`,['Date','Category','Type','Description','Amount','Method','Reference','Person'],[ ...fIncome.map(e=>[e.date,'Income',e.type,e.description,e.amount,e.method,e.reference,e.relatedPersonName]), ...fExpense.map(e=>[e.date,'Expense',e.type,e.description,e.amount,e.method,e.reference,e.recipient]) ].sort((a,b)=>String(b[0]).localeCompare(String(a[0]))))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/25 text-xs font-bold hover:bg-blue-500/20 transition-all">
                <Download className="w-3.5 h-3.5" /> All Transactions CSV
              </button>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════
          MODAL: Create Instructor Payment (Step 1 — Pending)
          ════════════════════════════════════════════════════ */}
      {createPayModal && (() => {
        const sched = instructorPaymentSchedules.find(s => s.instructorId === createPayModal);
        if (!sched) return null;
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Record Instructor Payment</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">{sched.instructorName} — {monthLabel(sched.nextDueDate)}</p>
                </div>
                <button onClick={() => setCreatePayModal(null)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Two-step process</div>
                <div>Step 1: Record the payment details (status → Pending).<br />Step 2: After you physically transfer the money, click "Confirm Transfer".<br />Only after Step 2 does the amount count as Finance outgoing.</div>
              </div>
              <form onSubmit={handleCreateInstructorPayment} className="space-y-3 text-xs">
                <div><label className={LC}>Amount (ETB) <span className="text-red-400">*</span></label>
                  <input type="number" required min="1" value={createPayForm.amount} onChange={e=>setCreatePayForm(f=>({...f,amount:e.target.value}))} placeholder={String(sched.arrangement.paymentAmount)} className={FC} /></div>
                <div><label className={LC}>Payment Date <span className="text-red-400">*</span></label>
                  <input type="date" required value={createPayForm.paymentDate} onChange={e=>setCreatePayForm(f=>({...f,paymentDate:e.target.value}))} className={FC} /></div>
                <div><label className={LC}>Payment Method</label>
                  <select value={createPayForm.method} onChange={e=>setCreatePayForm(f=>({...f,method:e.target.value}))} className={FC}>{PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className={LC}>Reference / Transaction No.</label>
                  <input type="text" value={createPayForm.reference} onChange={e=>setCreatePayForm(f=>({...f,reference:e.target.value}))} placeholder="e.g. TRX-2026-001" className={FC} /></div>
                <div><label className={LC}>Notes</label>
                  <textarea rows={2} value={createPayForm.notes} onChange={e=>setCreatePayForm(f=>({...f,notes:e.target.value}))} className={FC} /></div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 transition-all">Create Payment Record</button>
                  <button type="button" onClick={()=>setCreatePayModal(null)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════
          MODAL: Confirm Instructor Transfer (Step 2 — Confirmed)
          ════════════════════════════════════════════════════ */}
      {confirmPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <div>
                <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Confirm Payment Transfer</h3>
                <p className="text-[10px] text-[var(--text-muted)]">{confirmPayModal.instructorName} — {confirmPayModal.periodLabel}</p>
              </div>
              <button onClick={()=>setConfirmPayModal(null)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-default)] grid grid-cols-2 gap-2">
                <div><span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Amount</span><span className="font-mono font-bold text-emerald-400">{fmt(confirmPayModal.amount)}</span></div>
                <div><span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Method</span><span>{confirmPayModal.method}</span></div>
                <div><span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Period</span><span>{confirmPayModal.periodLabel}</span></div>
                <div><span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Reference</span><span className="font-mono">{confirmPayModal.reference || '—'}</span></div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold">
                ✓ Confirming this will mark the payment as PAID and add {fmt(confirmPayModal.amount)} to Finance outgoing. This action cannot be undone.
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleConfirmInstructorPayment} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Yes, Confirm Transfer
              </button>
              <button onClick={()=>setConfirmPayModal(null)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: Review Student Payment (Approve / Reject)
          ════════════════════════════════════════════════════ */}
      {reviewStudentPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <div>
                <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Review Student Payment</h3>
                <p className="text-[10px] text-[var(--text-muted)]">{reviewStudentPayModal.studentName} — {reviewStudentPayModal.paymentMonth}</p>
              </div>
              <button onClick={()=>{setReviewStudentPayModal(null);setReviewAction(null);}} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
            </div>

            {/* Payment info */}
            <div className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-default)] text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Amount:</span><span className="font-mono font-bold text-[var(--text-primary)]">{fmt(reviewStudentPayModal.monthlyAmount)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Month:</span><span className="font-mono">{reviewStudentPayModal.paymentMonth}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Submitted:</span><span className="font-mono">{reviewStudentPayModal.submittedDate ?? 'Not submitted'}</span></div>
              {reviewStudentPayModal.screenshotUrl && (
                <div><span className="text-[var(--text-muted)]">Screenshot:</span>
                  <a href={reviewStudentPayModal.screenshotUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#E9C349] underline text-[11px]">View Receipt</a>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {!reviewAction && (
              <div className="flex gap-2">
                <button onClick={()=>setReviewAction('approve')} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                  <CheckCircle className="w-4 h-4" /> Approve Payment
                </button>
                <button onClick={()=>setReviewAction('reject')} className="flex-1 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                  <XCircle className="w-4 h-4" /> Reject Payment
                </button>
              </div>
            )}

            {/* Approve form */}
            {reviewAction === 'approve' && (
              <form onSubmit={handleApproveStudentPayment} className="space-y-3 text-xs">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />Approving this payment adds {fmt(reviewStudentPayModal.monthlyAmount)} to confirmed income.</div>
                <div><label className={LC}>Confirmed Payment Date <span className="text-red-400">*</span></label>
                  <input type="date" required value={approveForm.paymentDate} onChange={e=>setApproveForm(f=>({...f,paymentDate:e.target.value}))} className={FC} /></div>
                <div><label className={LC}>Payment Method</label>
                  <select value={approveForm.method} onChange={e=>setApproveForm(f=>({...f,method:e.target.value}))} className={FC}>{PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className={LC}>Reference</label>
                  <input type="text" value={approveForm.reference} onChange={e=>setApproveForm(f=>({...f,reference:e.target.value}))} className={FC} /></div>
                <div><label className={LC}>Notes</label>
                  <textarea rows={2} value={approveForm.notes} onChange={e=>setApproveForm(f=>({...f,notes:e.target.value}))} className={FC} /></div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">Confirm Approval</button>
                  <button type="button" onClick={()=>setReviewAction(null)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-semibold transition-all">Back</button>
                </div>
              </form>
            )}

            {/* Reject form */}
            {reviewAction === 'reject' && (
              <form onSubmit={handleRejectStudentPayment} className="space-y-3 text-xs">
                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Rejecting will NOT count this as income. Student can resubmit.</div>
                <div><label className={LC}>Rejection Reason <span className="text-red-400">*</span></label>
                  <textarea rows={3} required value={rejectForm.reason} onChange={e=>setRejectForm(f=>({...f,reason:e.target.value}))} placeholder="e.g. Screenshot unclear, wrong amount, duplicate submission…" className={FC} /></div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all">Confirm Rejection</button>
                  <button type="button" onClick={()=>setReviewAction(null)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-semibold transition-all">Back</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: Create Student Payment Record
          ════════════════════════════════════════════════════ */}
      {createStudentPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Create Student Payment Record</h3>
              <button onClick={()=>setCreateStudentPayModal(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateStudentPayment} className="space-y-3 text-xs">
              <div><label className={LC}>Student <span className="text-red-400">*</span></label>
                <select required value={createStudentPayForm.studentId} onChange={e=>setCreateStudentPayForm(f=>({...f,studentId:e.target.value}))} className={FC}>
                  <option value="">— Select student —</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select></div>
              <div><label className={LC}>Monthly Amount (ETB) <span className="text-red-400">*</span></label>
                <input type="number" required min="1" value={createStudentPayForm.monthlyAmount} onChange={e=>setCreateStudentPayForm(f=>({...f,monthlyAmount:e.target.value}))} placeholder="e.g. 2500" className={FC} /></div>
              <div><label className={LC}>Payment Month <span className="text-red-400">*</span></label>
                <input type="month" required value={createStudentPayForm.paymentMonth} onChange={e=>setCreateStudentPayForm(f=>({...f,paymentMonth:e.target.value}))} className={FC} /></div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 transition-all">Create Record</button>
                <button type="button" onClick={()=>setCreateStudentPayModal(false)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-semibold transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: Add Manual Income Entry
          ════════════════════════════════════════════════════ */}
      {incomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Add Income Entry</h3>
              <button onClick={()=>setIncomeModalOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddIncomeSubmit} className="space-y-3 text-xs">
              <div><label className={LC}>Type <span className="text-red-400">*</span></label>
                <select value={incomeForm.type} onChange={e=>setIncomeForm(f=>({...f,type:e.target.value as IncomeEntry['type']}))} className={FC}>
                  <option value="Student Monthly Payment">Student Monthly Payment</option>
                  <option value="Registration Fee">Registration Fee</option>
                  <option value="Other Income">Other Income</option>
                </select></div>
              <div><label className={LC}>Description <span className="text-red-400">*</span></label>
                <input type="text" required value={incomeForm.description} onChange={e=>setIncomeForm(f=>({...f,description:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Amount (ETB) <span className="text-red-400">*</span></label>
                <input type="number" required min="1" value={incomeForm.amount} onChange={e=>setIncomeForm(f=>({...f,amount:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Date <span className="text-red-400">*</span></label>
                <input type="date" required value={incomeForm.date} onChange={e=>setIncomeForm(f=>({...f,date:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Payment Method</label>
                <select value={incomeForm.method} onChange={e=>setIncomeForm(f=>({...f,method:e.target.value}))} className={FC}>{PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
              <div><label className={LC}>Reference</label>
                <input type="text" value={incomeForm.reference} onChange={e=>setIncomeForm(f=>({...f,reference:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Related Person</label>
                <input type="text" value={incomeForm.relatedPersonName} onChange={e=>setIncomeForm(f=>({...f,relatedPersonName:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Notes</label>
                <textarea rows={2} value={incomeForm.notes} onChange={e=>setIncomeForm(f=>({...f,notes:e.target.value}))} className={FC} /></div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">Save Income</button>
                <button type="button" onClick={()=>setIncomeModalOpen(false)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-semibold transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: Add Manual Expense Entry
          ════════════════════════════════════════════════════ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Add Expense Entry</h3>
              <button onClick={()=>setExpenseModalOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div><label className={LC}>Type <span className="text-red-400">*</span></label>
                <select value={expenseForm.type} onChange={e=>setExpenseForm(f=>({...f,type:e.target.value as ExpenseEntry['type']}))} className={FC}>
                  <option value="Instructor Payment">Instructor Payment</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select></div>
              <div><label className={LC}>Description <span className="text-red-400">*</span></label>
                <input type="text" required value={expenseForm.description} onChange={e=>setExpenseForm(f=>({...f,description:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Amount (ETB) <span className="text-red-400">*</span></label>
                <input type="number" required min="1" value={expenseForm.amount} onChange={e=>setExpenseForm(f=>({...f,amount:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Date <span className="text-red-400">*</span></label>
                <input type="date" required value={expenseForm.date} onChange={e=>setExpenseForm(f=>({...f,date:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Payment Method</label>
                <select value={expenseForm.method} onChange={e=>setExpenseForm(f=>({...f,method:e.target.value}))} className={FC}>{PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
              <div><label className={LC}>Recipient</label>
                <input type="text" value={expenseForm.recipient} onChange={e=>setExpenseForm(f=>({...f,recipient:e.target.value}))} className={FC} /></div>
              <div><label className={LC}>Reference</label>
                <input type="text" value={expenseForm.reference} onChange={e=>setExpenseForm(f=>({...f,reference:e.target.value}))} className={FC} /></div>
              {expenseForm.type === 'Instructor Payment' && (
                <div><label className={LC}>Related Instructor</label>
                  <select value={expenseForm.relatedInstructorId} onChange={e=>setExpenseForm(f=>({...f,relatedInstructorId:e.target.value}))} className={FC}>
                    <option value="">— Select instructor —</option>
                    {instructors.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
                  </select></div>
              )}
              <div><label className={LC}>Notes</label>
                <textarea rows={2} value={expenseForm.notes} onChange={e=>setExpenseForm(f=>({...f,notes:e.target.value}))} className={FC} /></div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all">Save Expense</button>
                <button type="button" onClick={()=>setExpenseModalOpen(false)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-semibold transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
