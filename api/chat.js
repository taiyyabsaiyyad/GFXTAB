// api/chat.js — Vercel Serverless (Node 18+)
export default async function handler(req, res) {
  // CORS: restrict this to your Pages domain later (replace '*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages[] required' });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.MODEL || 'gpt-4o-mini',
        messages,
        temperature: 0.6
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: 'upstream_error', detail: text });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
}
