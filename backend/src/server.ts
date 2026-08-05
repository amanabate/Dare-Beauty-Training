import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Dare Beauty Training Institute API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Dare Beauty API server running on http://localhost:${PORT}`);
});

export default app;
