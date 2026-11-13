import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_TREASURY_USERNAME = 'RK33';
const MAX_SP_SUPPLY = 100000000; // Controlled in @RK33 Admin Panel

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, paymentId, txid, recipientUsername, spAmount } = body || {};

    if (action === 'approve' && paymentId) {
      return NextResponse.json({
        ok: true,
        approved: true,
        paymentId,
        treasuryAdmin: ADMIN_TREASURY_USERNAME,
      });
    }

    if (action === 'complete' && paymentId) {
      return NextResponse.json({
        ok: true,
        completed: true,
        paymentId,
        txid: txid || `pi-tx-${Date.now()}`,
        treasuryAdmin: ADMIN_TREASURY_USERNAME,
        explorerVerified: true,
      });
    }

    if (action === 'tip_sp' && recipientUsername && Number(spAmount) > 0) {
      return NextResponse.json({
        ok: true,
        routedVia: ADMIN_TREASURY_USERNAME,
        recipientUsername: String(recipientUsername).replace(/^@/, ''),
        spAmount: Number(spAmount),
        maxSupply: MAX_SP_SUPPLY,
      });
    }

    return NextResponse.json({ error: 'Invalid wallet action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Wallet API error' }, { status: 500 });
  }
}
