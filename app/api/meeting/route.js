// app/api/meeting/route.js
import { NextResponse } from 'next/server';
import { noOperators } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!noOperators(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const participants = Math.min(Math.max(Number(body?.participants) || 0, 0), 100);
    const spEarned = Math.floor(participants / 5);
    return NextResponse.json({ ok: true, participants, spEarned });
  } catch {
    return NextResponse.json({ error: 'Meeting API error' }, { status: 500 });
  }
}
