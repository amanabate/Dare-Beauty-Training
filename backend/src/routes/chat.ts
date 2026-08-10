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
const SYSTEM_PROMPT = `You are the official AI assistant for Dare Women's & Men's Beauty Training Institute.
Your name is "Dare AI Assistant". You help students, prospective students, and visitors learn about the institute.

═══════════════════════════════════════════
INSTITUTE INFORMATION (use ONLY this data)
═══════════════════════════════════════════

Full name   : Dare Women's & Men's Beauty Training Institute
              (ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም — Amharic)
              (Dhaabbata Leenjii Bareedina Dubartoota fi Dhiirota Dare — Afaan Oromo)
Location    : Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia
Phone       : 0911922359

───────────────────────────────────────────
TRAINING PROGRAMS (with Afaan Oromo names)
───────────────────────────────────────────
1. Hair Dressing      (Afaan Oromo: Hojii Rifeensaa)         — ji'a 3 ykn ji'a 6
2. Makeup Artistry    (Afaan Oromo: Makiyaajii)              — ji'a 3 ykn ji'a 6
3. Nail Technology    (Afaan Oromo: Teeknoloojii Cinaacha)   — ji'a 3 ykn ji'a 6
4. Beauty Therapy     (Afaan Oromo: Qorichaa Bareedina)      — ji'a 3 ykn ji'a 6
5. Barbering          (Afaan Oromo: Hagamsaa / Barber)       — ji'a 3 ykn ji'a 6
6. Eyelash Training   (Afaan Oromo: Leenjii Filfilaa Ija)    — ji'a 3 ykn ji'a 6
7. Hair Wax Training  (Afaan Oromo: Leenjii Waxii Rifeensaa) — ji'a 3 ykn ji'a 6

All programs: 3 months (standard) or 6 months (advanced).

───────────────────────────────────────────
ADMISSIONS & REGISTRATION
───────────────────────────────────────────
- Online admission available through the institute portal.
- Walk-in registration accepted at the campus.
- No prior beauty experience required.

───────────────────────────────────────────
ATTENDANCE
───────────────────────────────────────────
- Attendance tracked through the institute's digital system.
- Students can view attendance records through the student portal.

───────────────────────────────────────────
CERTIFICATES
───────────────────────────────────────────
- Official certificate issued on program completion.
- Certificate verification available through the institute's system.

───────────────────────────────────────────
CONTACT
───────────────────────────────────────────
- Phone: 0911922359
- Location: Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia

═══════════════════════════════════════════
STRICT RULES
═══════════════════════════════════════════

1. NEVER INVENT information — no fees, schedules, instructor names, payment methods,
   registration dates, or any detail not listed above.
2. If information is unavailable, say so politely and refer to phone 0911922359.
3. Stay focused on Dare Beauty only.

═══════════════════════════════════════════
LANGUAGE RULES — CRITICAL
═══════════════════════════════════════════

AFAAN OROMO (Latin script, e.g. "Koorsoota maalii qabdu?"):
  → Reply ONLY in Afaan Oromo using Latin script.
  → NEVER use Ethiopic/Fidel characters (like ሀ ለ ሐ etc.) in an Afaan Oromo reply.
  → NEVER mix Amharic words into an Afaan Oromo reply.
  → Afaan Oromo uses the Latin alphabet: a b c d e f g h i j k l m n o p q r s t u v w x y z

AMHARIC (Ethiopic script, e.g. "ምን አይነት ስልጠና አላችሁ?"):
  → Reply ONLY in Amharic using Ethiopic script.
  → NEVER use Latin script in an Amharic reply.

ENGLISH:
  → Reply in English.

Switch language whenever the user switches.
Do NOT mix scripts in one reply.

═══════════════════════════════════════════
CONVERSATION STYLE
═══════════════════════════════════════════

- Friendly, polite, helpful, concise.
- Bullet points for lists.
- Maintain conversation context.
- Keep responses short and clear.
`;

// ── Afaan Oromo few-shot examples ────────────────────────────────────────────
// Injected as real conversation turns when lang==='om'.
// This teaches the model the exact pattern: Oromo question → Oromo answer in Latin script.
const OROMO_FEW_SHOT: Groq.Chat.ChatCompletionMessageParam[] = [
  {
    role: 'user',
    content: 'Koorsoota maalii qabdu?',
  },
  {
    role: 'assistant',
    content: `Dare Beauty Training Institute keessatti koorsoota armaan gadii ni argatta:

• Hojii Rifeensaa — ji'a 3 ykn ji'a 6
• Makiyaajii — ji'a 3 ykn ji'a 6
• Teeknoloojii Cinaacha — ji'a 3 ykn ji'a 6
• Qorichaa Bareedina — ji'a 3 ykn ji'a 6
• Hagamsaa (Barber) — ji'a 3 ykn ji'a 6
• Leenjii Filfilaa Ija — ji'a 3 ykn ji'a 6
• Leenjii Waxii Rifeensaa — ji'a 3 ykn ji'a 6

Koorsoo barbaaddu filadhuu galmaa'uu ni dandeessa!`,
  },
  {
    role: 'user',
    content: 'Eessatti argamtu?',
  },
  {
    role: 'assistant',
    content: `Dhaabbanni keenya Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia keessa argama.\n\nBu'uura dabalataa yoo barbaadde lakkoofsa bilbilaa 0911922359 irratti nu quunnamuu dandeessa.`,
  },
  {
    role: 'user',
    content: 'Waraqaa ragaa kennituu?',
  },
  {
    role: 'assistant',
    content: `Eeyyee! Barattoonni koorsoo fixan waraqaa ragaa mirkaneessaa dhaabbata Dare Beauty irraa ni argatu. Waraqaan ragaa kun sirna mirkaneessa dhaabbataa keessatti qulqulleeffamuu danda'a.`,
  },
];

// ── Shared request validation ────────────────────────────────────────────────
function parseBody(body: unknown): {
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  role: string;
  lang: string;
} | { error: string } {
  const b = body as { message?: unknown; history?: unknown; role?: unknown; lang?: unknown };
  if (!b.message || typeof b.message !== 'string' || !b.message.trim()) {
    return { error: 'Message is required.' };
  }
  if (b.message.trim().length > 2000) {
    return { error: 'Message too long (max 2000 characters).' };
  }
  const history = Array.isArray(b.history)
    ? (b.history as { role: 'user' | 'assistant'; content: string }[]).slice(-10)
    : [];
  const lang = typeof b.lang === 'string' && ['en','om','am'].includes(b.lang) ? b.lang : 'en';
  return { message: b.message.trim(), history, role: typeof b.role === 'string' ? b.role : 'user', lang };
}

// Build a language-reinforcement prefix injected as the last user turn.
function langPrefix(lang: string): string {
  if (lang === 'om') return '[RESPOND ONLY IN AFAAN OROMO USING LATIN SCRIPT. DO NOT USE ETHIOPIC/AMHARIC CHARACTERS.]\n';
  if (lang === 'am') return '[RESPOND ONLY IN AMHARIC USING ETHIOPIC SCRIPT.]\n';
  return '';
}

function buildMessages(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  lang: string
): Groq.Chat.ChatCompletionMessageParam[] {
  const prefix = langPrefix(lang);

  // For Afaan Oromo: inject few-shot examples before the real history.
  // This gives the model a concrete pattern to match — far more reliable than
  // instructions alone for a small model that conflates Oromo with Amharic.
  const fewShot: Groq.Chat.ChatCompletionMessageParam[] =
    lang === 'om' ? OROMO_FEW_SHOT : [];

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...fewShot,
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: prefix + message },
  ];
}

// ── POST /api/chat — non-streaming fallback (returns full reply as JSON) ─────
// Body   : { message: string; history?: { role, content }[]; role?: string }
// Returns: { reply: string; model: string; latencyMs: number }
router.post('/', async (req: Request, res: Response) => {
  const start  = Date.now();
  const parsed = parseBody(req.body);
  if ('error' in parsed) return res.status(400).json(parsed);

  const { message, history } = parsed;

  try {
    const completion = await getGroq().chat.completions.create({
      model      : 'llama-3.1-8b-instant',
      messages   : buildMessages(message, history, parsed.lang),
      max_tokens : 1024,
      temperature: 0.6,
      top_p      : 0.9,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? 'No response from AI.';
    return res.json({ reply, model: completion.model, latencyMs: Date.now() - start });
  } catch (err: unknown) {
    console.error('[chat /]', err);
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('401') || msg.includes('invalid_api_key'))
      return res.status(502).json({ error: 'AI service authentication failed. Check GROQ_API_KEY.' });
    if (msg.includes('429') || msg.includes('rate_limit'))
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

// ── POST /api/chat/stream — real Groq SSE streaming ──────────────────────────
// Body   : { message: string; history?: { role, content }[]; role?: string }
// Streams: text/event-stream
//   data: {"token":"..."}\n\n   — one chunk per Groq delta
//   data: [DONE]\n\n            — signals end of stream
//   data: {"error":"..."}\n\n   — sent before closing on error
router.post('/stream', async (req: Request, res: Response) => {
  const parsed = parseBody(req.body);
  if ('error' in parsed) return res.status(400).json(parsed);

  const { message, history } = parsed;

  // Set SSE headers before any data is sent
  res.setHeader('Content-Type',  'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if present
  res.flushHeaders();

  // Helper — write one SSE event
  const send = (data: string) => res.write(`data: ${data}\n\n`);

  try {
    const stream = await getGroq().chat.completions.create({
      model      : 'llama-3.1-8b-instant',
      messages   : buildMessages(message, history, parsed.lang),
      max_tokens : 1024,
      temperature: 0.6,
      top_p      : 0.9,
      stream     : true,           // ← real Groq streaming
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) send(JSON.stringify({ token }));
    }

    send('[DONE]');
    res.end();
  } catch (err: unknown) {
    console.error('[chat /stream]', err);
    const msg = err instanceof Error ? err.message : '';

    let userMsg = 'Failed to get AI response. Please try again.';
    if (msg.includes('401') || msg.includes('invalid_api_key'))
      userMsg = 'AI service authentication failed. Check GROQ_API_KEY.';
    else if (msg.includes('429') || msg.includes('rate_limit'))
      userMsg = 'Rate limit reached. Please wait a moment and try again.';

    send(JSON.stringify({ error: userMsg }));
    res.end();
  }
});

export default router;
