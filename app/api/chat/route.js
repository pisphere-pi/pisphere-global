import { NextResponse } from 'next/server';
import { clean, noOperators } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!noOperators(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { action, toUsername, spAmount, roomType, members, posts24h } = body || {};

    if (action === 'tip_sp') {
      const target = clean(toUsername, 60).replace(/^@/, '');
      const amount = Number(spAmount);
      if (!target || !amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid tip details' }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        tippedTo: target,
        spAmount: amount,
        routedViaTreasury: 'RK33',
      });
    }

    if (action === 'verify_group_sp') {
      const capped = Math.min(Number(members) || 0, 250);
      const posts = Number(posts24h) || 0;
      let sp = 0;
      if (posts >= 5) {
        if (capped >= 200) sp = 120;
        else if (capped >= 150) sp = 70;
        else if (capped >= 120) sp = 30;
        else if (capped >= 90) sp = 12;
        else if (capped >= 60) sp = 5;
        else if (capped >= 30) sp = 1;
      }
      return NextResponse.json({ ok: true, roomType: roomType || 'group', spEarned: sp });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Chat API error' }, { status: 500 });
  }
}
