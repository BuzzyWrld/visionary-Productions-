import type { APIRoute } from 'astro';

// On demand. Keeps the rest of the site static while this endpoint runs server side.
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 4000;

// Best effort in memory rate limit. Resets per serverless instance, which is
// fine as a first line of defense. Tighten with a real store if abuse appears.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : '';
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot. Bots fill this, people do not.
  if (clean(payload.company)) return json({ ok: true }, 200);

  const name = clean(payload.name);
  const email = clean(payload.email);
  const message = clean(payload.message);
  const date = clean(payload.date);
  const idea = clean(payload.idea);

  if (!name || !email || !message) return json({ error: 'Name, email, and the vision are required.' }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: 'That email does not look right.' }, 400);

  const ip = clientAddress ?? 'unknown';
  if (rateLimited(ip)) return json({ error: 'Slow down a moment, then try again.' }, 429);

  const token = import.meta.env.AIRTABLE_TOKEN;
  const base = import.meta.env.AIRTABLE_BASE;
  const table = import.meta.env.AIRTABLE_TABLE;

  if (!token || !base || !table) {
    // Misconfigured server. Do not leak which piece is missing to the client.
    console.error('[contact] Missing Airtable env vars.');
    return json({ error: 'Inquiries are temporarily unavailable. DM @kai_photoproductions.' }, 503);
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Name: name,
            Email: email,
            Date: date,
            Idea: idea,
            Message: message,
            Source: 'visionaryproductions.nyc',
          },
        }],
        typecast: true,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[contact] Airtable error', res.status, detail);
      return json({ error: 'Could not send right now. Try again shortly.' }, 502);
    }
  } catch (err) {
    console.error('[contact] Airtable request failed', err);
    return json({ error: 'Network error reaching the inbox. Try again.' }, 502);
  }

  return json({ ok: true }, 200);
};
