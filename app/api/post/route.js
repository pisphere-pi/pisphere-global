// app/api/post/route.js
import { NextResponse } from 'next/server';
import { noOperators } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!noOperators(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const likes = Math.max(Number(body?.likes) || 0, 0);
    const spEarned = Math.floor(likes / 100);
    return NextResponse.json({ ok: true, likes, spEarned, routedVia: 'RK33' });
  } catch {
    return NextResponse.json({ error: 'Post API error' }, { status: 500 });
  }
}
