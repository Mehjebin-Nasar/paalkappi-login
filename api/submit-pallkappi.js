const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL env var');
    return res.status(500).json({ error: 'Server misconfigured: DATABASE_URL not set' });
  }

  const { name, regno, department, semester, phone, email, event } = req.body || {};

  if (!name || !regno || !department || !semester || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO pallkappi_registrations (name, regno, department, semester, phone, email, event)
      VALUES (${name}, ${regno}, ${department}, ${semester}, ${phone}, ${email}, ${event || null})
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Insert failed:', err);
    return res.status(500).json({ error: 'Failed to save', detail: err.message });
  }
};
