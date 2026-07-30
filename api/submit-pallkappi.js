import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { name, regno, department, semester, phone, email, event } = req.body;

  try {
    await sql`
      INSERT INTO pallkappi_registrations (name, regno, department, semester, phone, email, event)
      VALUES (${name}, ${regno}, ${department}, ${semester}, ${phone}, ${email}, ${event})
    `;
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save' });
  }
}