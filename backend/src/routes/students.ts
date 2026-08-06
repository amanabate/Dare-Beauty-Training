import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/dashboard/students
// Returns the student roster (Admin / Instructor access)
router.get('/', (_req: Request, res: Response) => {
  // TODO: replace with Prisma DB query
  // e.g. const students = await prisma.student.findMany({ include: { program: true } });
  res.json({
    data: [],
    message: 'Connect Prisma to return real student records.',
  });
});

// GET /api/dashboard/students/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: const student = await prisma.student.findUnique({ where: { id } });
  res.json({ id, message: 'Student detail endpoint — connect Prisma.' });
});

// POST /api/dashboard/students
router.post('/', (req: Request, res: Response) => {
  // TODO: await prisma.student.create({ data: req.body });
  res.status(201).json({ message: 'Student creation endpoint — connect Prisma.' });
});

// PATCH /api/dashboard/students/:id
router.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: await prisma.student.update({ where: { id }, data: req.body });
  res.json({ id, message: 'Student update endpoint — connect Prisma.' });
});

// DELETE /api/dashboard/students/:id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: await prisma.student.delete({ where: { id } });
  res.json({ id, message: 'Student delete endpoint — connect Prisma.' });
});

export default router;
