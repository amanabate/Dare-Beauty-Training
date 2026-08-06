import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const router = Router();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dare-secret-key-change-in-production');

// POST /api/auth/signin
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // TODO: replace with real DB lookup via Prisma
    // Placeholder demo accounts matching frontend mock data
    const DEMO_USERS = [
      { id: 'usr-001', email: 'admin@darebeauty.edu.et',      passwordHash: await bcrypt.hash('admin123', 10),   role: 'Admin',      fullName: 'Dare Admin',       joinedDate: '2025-01-01' },
      { id: 'usr-002', email: 'selamawit@darebeauty.edu.et',  passwordHash: await bcrypt.hash('instructor123', 10), role: 'Instructor', fullName: 'Selamawit Abera', joinedDate: '2025-01-10' },
      { id: 'usr-003', email: 'bethlehem.worku@gmail.com',    passwordHash: await bcrypt.hash('student123', 10), role: 'Student',     fullName: 'Bethlehem Worku', joinedDate: '2026-01-10', programEnrolled: 'Hair Dressing & Styling' },
    ];

    const user = DEMO_USERS.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const { passwordHash: _ph, ...safeUser } = user;

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('[auth/signin]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role = 'Applicant' } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }
    // TODO: persist to DB via Prisma, check for duplicate email
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { id: `usr-${Date.now()}`, fullName, email, role, joinedDate: new Date().toISOString().slice(0, 10) };

    const token = await new SignJWT({ sub: newUser.id, email, role, fullName })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('[auth/signup]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/me  — verify token and return user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return res.json({ user: payload });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

export default router;
