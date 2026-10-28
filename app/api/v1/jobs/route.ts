import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || undefined;
  const jobType = searchParams.get('jobType') || undefined;
  const search = searchParams.get('search') || undefined;

  const jobs = newsStore.getJobs({ region, jobType, search });
  return NextResponse.json({ jobs, total: jobs.length });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.company_name) {
      return NextResponse.json({ error: 'title and company_name are required' }, { status: 400 });
    }

    const saved = newsStore.saveJob(data);
    try { revalidatePath('/jobs', 'page'); } catch {}
    return NextResponse.json({ success: true, job: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const deleted = newsStore.deleteJob(id);
  try { revalidatePath('/jobs', 'page'); } catch {}
  return NextResponse.json({ success: deleted });
}
