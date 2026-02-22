import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// PATCH — Update log status: approve, reject, post-now
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['approved', 'rejected', 'posted', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === 'approved' || status === 'posted') {
      updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('auto_post_logs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, log: data });
  } catch (error) {
    console.error('[auto-post/logs/[id] PATCH]', error);
    return NextResponse.json({ error: 'Failed to update log' }, { status: 500 });
  }
}
