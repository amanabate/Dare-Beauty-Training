import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import attendanceRoutes from './routes/attendance';
import applicationRoutes from './routes/applications';
import instructorRoutes from './routes/instructors';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow the Next.js frontend to call the Express API.
// In production, replace the origin with your real domain.
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Auth ──────────────────────────────────────────────────────────────
// POST   /api/auth/signin          Sign in, returns JWT + user
// POST   /api/auth/signup          Register new account
// GET    /api/auth/me              Verify token, return user payload
app.use('/api/auth', authRoutes);

// ── Dashboard: Students ───────────────────────────────────────────────
// GET    /api/dashboard/students         List all students
// GET    /api/dashboard/students/:id     Single student
// POST   /api/dashboard/students         Create student
// PATCH  /api/dashboard/students/:id     Update student
// DELETE /api/dashboard/students/:id     Delete student
app.use('/api/dashboard/students', studentRoutes);

// ── Dashboard: Attendance ────────────────────────────────────────────
// GET    /api/dashboard/attendance       Query attendance records
// POST   /api/dashboard/attendance       Mark attendance
app.use('/api/dashboard/attendance', attendanceRoutes);

// ── Applications ──────────────────────────────────────────────────────
// GET    /api/applications               List all applications
// POST   /api/applications               Submit new application (multipart)
// PATCH  /api/applications/:id/approve   Approve application
// PATCH  /api/applications/:id/reject    Reject application
app.use('/api/applications', applicationRoutes);

// ── Dashboard: Instructors ───────────────────────────────────────────
// GET    /api/dashboard/instructors      List instructors
// GET    /api/dashboard/instructors/:id  Single instructor
app.use('/api/dashboard/instructors', instructorRoutes);

// ── AI Chat ───────────────────────────────────────────────────────────────────
// POST   /api/chat                       Send message → Groq → return AI reply
app.use('/api/chat', chatRoutes);

// ── Health ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Dare Beauty Training Institute API',
    timestamp: new Date().toISOString(),
    routes: [
      'POST   /api/auth/signin',
      'POST   /api/auth/signup',
      'GET    /api/auth/me',
      'GET    /api/dashboard/students',
      'POST   /api/dashboard/students',
      'PATCH  /api/dashboard/students/:id',
      'DELETE /api/dashboard/students/:id',
      'GET    /api/dashboard/attendance',
      'POST   /api/dashboard/attendance',
      'GET    /api/applications',
      'POST   /api/applications',
      'PATCH  /api/applications/:id/approve',
      'PATCH  /api/applications/:id/reject',
      'GET    /api/dashboard/instructors',
      'POST   /api/chat',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Dare Beauty API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
