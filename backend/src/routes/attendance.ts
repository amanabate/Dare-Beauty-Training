import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/dashboard/attendance?studentId=&date=
router.get('/', (req: Request, res: Response) => {
  const { studentId, date } = req.query;
  // TODO: const records = await prisma.attendance.findMany({ where: { studentId, date } });
  res.json({ studentId, date, data: [], message: 'Connect Prisma to return attendance records.' });
});

// POST /api/dashboard/attendance — mark attendance for a session
router.post('/', (req: Request, res: Response) => {
  // body: { studentId, date, status: 'Present' | 'Absent' | 'Late', sessionId, instructorId }
  // TODO: await prisma.attendance.create({ data: req.body });
  res.status(201).json({ message: 'Attendance recorded — connect Prisma.' });
});

export default router;
