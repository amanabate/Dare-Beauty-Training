import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Store uploaded receipts in /uploads/receipts/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/receipts'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `receipt-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

// GET /api/applications
router.get('/', (_req: Request, res: Response) => {
  // TODO: const apps = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ data: [], message: 'Connect Prisma to return applications.' });
});

// POST /api/applications — submit new application with receipt upload
router.post('/', upload.single('paymentReceipt'), (req: Request, res: Response) => {
  const receiptPath = req.file?.path ?? null;
  // TODO: await prisma.application.create({ data: { ...req.body, paymentReceiptPath: receiptPath } });
  res.status(201).json({ message: 'Application submitted.', receiptPath });
});

// PATCH /api/applications/:id/approve
router.patch('/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: await prisma.application.update({ where: { id }, data: { status: 'Approved' } });
  res.json({ id, status: 'Approved', message: 'Application approved — connect Prisma.' });
});

// PATCH /api/applications/:id/reject
router.patch('/:id/reject', (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: await prisma.application.update({ where: { id }, data: { status: 'Rejected' } });
  res.json({ id, status: 'Rejected', message: 'Application rejected — connect Prisma.' });
});

export default router;
