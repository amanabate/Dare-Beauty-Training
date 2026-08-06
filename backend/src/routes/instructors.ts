import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/dashboard/instructors
router.get('/', (_req: Request, res: Response) => {
  // TODO: const instructors = await prisma.instructor.findMany();
  res.json({ data: [], message: 'Connect Prisma to return instructor records.' });
});

// GET /api/dashboard/instructors/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: const instructor = await prisma.instructor.findUnique({ where: { id } });
  res.json({ id, message: 'Instructor detail endpoint — connect Prisma.' });
});

export default router;
