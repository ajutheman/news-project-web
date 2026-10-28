import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET() {
  const rates = newsStore.getDailyRates();
  const currencies = newsStore.getCurrencies();
  return NextResponse.json({ rates, currencies });
}

export async function POST(request: Request) {
  try {
    const { id, amount_inr, change_inr } = await request.json();
    if (!id || typeof amount_inr !== 'number') {
      return NextResponse.json({ error: 'id and amount_inr are required' }, { status: 400 });
    }

    const updated = newsStore.updateDailyRate(id, amount_inr, change_inr || 0);
    if (!updated) {
      return NextResponse.json({ error: 'Rate item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rate: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update rate' }, { status: 500 });
  }
}
