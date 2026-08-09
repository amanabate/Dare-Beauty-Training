import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';

const router = Router();

// Groq client is created lazily inside the handler so it reads GROQ_API_KEY
// AFTER dotenv.config() has already run in server.ts.
let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in backend/.env');
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

// ── System prompt ────────────────────────────────────────────────────────────
// Gives the model full context about Dare Beauty Training Institute so it can
// answer any question about programs, admissions, attendance, certificates, etc.
const SYSTEM_PROMPT = `You are the official AI assistant for Dare Women's & Men's Beauty Training Institute (ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም), a professional vocational beauty training institute in Addis Ababa, Ethiopia.

INSTITUTE OVERVIEW:
- Full name: Dare Women's & Men's Beauty Training Institute
- Location: Addis Ababa, Ethiopia
- Mission: Provide government-accredited practical vocational beauty education
- Recognition: Government-recognized certificates, TVET (Technical and Vocational Education and Training) accredited
- COC: Students prepare for the national COC (Certificate of Competence) practical examination

TRAINING PROGRAMS OFFERED:
1. Hair Dressing & Styling — 3 or 6 months | Covers cutting, blowdry, chemical processing, braiding, bridal styling
2. Barbering & Men's Grooming — 3 or 6 months | Fading, shaving, beard sculpture, men's skincare
3. Professional Makeup Artistry — 3 or 6 months | Day, evening, bridal, editorial, special effects makeup
4. Nail Care Technology — 1 or 3 months | Gel, acrylic, nail art, extensions, pedicure spa
5. Beauty Therapy & Skincare — 3 or 6 months | Facial treatments, body therapy, medical spa, waxing
6. Eyelash Extension — 1 month | Classic, hybrid, volume, mega-volume lashes
7. Hair Waxing & Body Treatments — 1 month | Full-body waxing, threading, depilation

COURSE DURATION OPTIONS:
- Short courses: 1 month (Lash Extension, Waxing)
- Standard diplomas: 3 months
- Advanced master diplomas: 6 months
- Shifts available: Morning (8:30AM–12:30PM), Afternoon (1:30PM–5:30PM), Evening (5:30PM–8:30PM), Weekend

FEES & PAYMENT:
- Tuition varies by program and duration (approx 8,000–15,000 ETB total)
- Flexible installment payment plans available
- Payment methods: Telebirr, CBE Birr, CBO Mobile Banking, bank transfer
- COC examination fee is separate and paid to TVET authority

ADMISSIONS & REGISTRATION:
- Requirements: Copy of ID/Passport, 2 passport-size photos, grade 8 or 10 completion certificate
- No prior beauty experience required
- Online application available on the institute website
- Walk-in registration also accepted at the campus
- Enrollment happens on a rolling basis (no fixed semester start dates)

ATTENDANCE & COC COMPLIANCE:
- Minimum 75% attendance required to qualify for COC practical examination
- Biometric check-in system used to record attendance
- Students below 75% are flagged and given follow-up support
- Attendance tracked as: Present, Late (within 30-min grace), Absent, Excused, Holiday

CERTIFICATES & GRADUATION:
- Government-recognized Vocational Qualification Certificate issued on completion
- COC Certificate issued after passing the national practical examination
- Certificates include QR verification code for authenticity
- Recognized for employment both in Ethiopia and internationally

STAFF & INSTRUCTORS:
- All instructors are TVET-certified master trainers
- Instructor: Selamawit Abera (Senior Hair Artistry Master, 8 years experience)
- Studio space includes equipped practice salon, dummy heads, live models

STUDENT PORTAL:
- Students can access their attendance records, grades, and announcements via the portal
- Admin dashboard allows managing enrollments, payments, grades, certificates
- Instructor dashboard allows marking attendance, recording practical assessment scores

LANGUAGE SUPPORT:
- Institute serves students in English, Amharic (አማርኛ), and Afaan Oromoo
- Answer in the same language the user is writing in when possible

TONE & BEHAVIOR:
- Be helpful, professional, warm, and concise
- If asked about specific student data you don't have, explain you can only access anonymised summary data
- Do not make up specific student names or records unless they appear in the conversation context
- For anything requiring a human decision (enrollment approval, payment confirmation), advise the user to contact the admin desk
- Keep responses focused — bullet points for lists, plain paragraphs for explanations
- If asked something unrelated to the institute, politely redirect to institute topics`;

// POST /api/chat — returns the full AI reply as JSON.
// The typing animation is done client-side, so no SSE needed.
// Body: { message: string; history?: { role, content }[]; role?: string }
// Returns: { reply: string; model: string; latencyMs: number }
router.post('/', async (req: Request, res: Response) => {
  const start = Date.now();

  try {
    const { message, history = [], role = 'user' } = req.body as {
      message: string;
      history?: { role: 'user' | 'assistant'; content: string }[];
      role?: string;
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.trim().length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
    }

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user', content: message.trim() },
    ];

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 1024,
      temperature: 0.6,
      top_p: 0.9,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? 'No response from AI.';

    return res.json({
      reply,
      model: completion.model,
      latencyMs: Date.now() - start,
    });
  } catch (err: unknown) {
    console.error('[chat route]', err);
    const msg = err instanceof Error ? err.message : 'Unexpected error.';

    if (msg.includes('401') || msg.includes('invalid_api_key')) {
      return res.status(502).json({ error: 'AI service authentication failed. Check GROQ_API_KEY.' });
    }
    if (msg.includes('429') || msg.includes('rate_limit')) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }
    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

export default router;
