import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const staff = newsStore.getStaffUsers();
  return NextResponse.json({ staff, total: staff.length });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.email || !data.name || !data.role) {
      return NextResponse.json({ error: 'email, name, and role are required' }, { status: 400 });
    }

    const saved = newsStore.saveStaffUser(data);
    return NextResponse.json({ success: true, staff: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const deleted = newsStore.deleteStaffUser(id);
  return NextResponse.json({ success: deleted });
}
