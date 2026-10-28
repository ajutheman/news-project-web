import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET() {
  const rates = newsStore.getDailyRates();
  const currencies = newsStore.getCurrencies();
  return NextResponse.json({ rates, currencies });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Currency Exchange Rate Update / Creation
    if (payload.type === 'currency' || payload.code) {
      const { code, rate_to_inr, name_en, name_ml, flag } = payload;
      if (!code || typeof rate_to_inr !== 'number') {
        return NextResponse.json(
          { error: 'code and numeric rate_to_inr are required' },
          { status: 400 }
        );
      }

      if (name_en && name_ml) {
        // Save or add new currency
        const saved = newsStore.saveCurrency({
          code: code.toUpperCase().trim(),
          name_en: name_en.trim(),
          name_ml: name_ml.trim(),
          rate_to_inr,
          flag: flag || '🌐',
        });
        return NextResponse.json({ success: true, currency: saved });
      } else {
        // Update existing currency rate
        const updated = newsStore.updateCurrency(code.toUpperCase().trim(), rate_to_inr);
        if (!updated) {
          return NextResponse.json({ error: `Currency code ${code} not found` }, { status: 404 });
        }
        return NextResponse.json({ success: true, currency: updated });
      }
    }

    // 2. Gold & Bullion Rate Update
    const { id, amount_inr, change_inr } = payload;
    if (!id || typeof amount_inr !== 'number') {
      return NextResponse.json(
        { error: 'id and numeric amount_inr are required for bullion rate' },
        { status: 400 }
      );
    }

    const updated = newsStore.updateDailyRate(id, amount_inr, change_inr || 0);
    if (!updated) {
      return NextResponse.json({ error: 'Rate item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rate: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update rates' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (code) {
      const success = newsStore.deleteCurrency(code);
      return NextResponse.json({ success });
    }
    return NextResponse.json({ error: 'code parameter required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 });
  }
}
