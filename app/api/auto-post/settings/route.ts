import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS for admin API operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // matches .env.local
);

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// GET current settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('auto_post_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('[auto-post/settings GET]', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST — Save settings & fire n8n webhook
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      is_active,
      source_type,
      product_id,
      category_id,
      only_promo,
      frequency_type,
      interval_hours,
      posts_per_day,
      scheduled_times,
      start_date,
      end_date,
      require_email_confirmation,
      global_text,
    } = body;

    // Upsert settings (singleton row)
    const { data: settings, error: upsertError } = await supabase
      .from('auto_post_settings')
      .upsert(
        {
          is_active,
          source_type,
          product_id: product_id || null,
          category_id: category_id || null,
          only_promo: !!only_promo,
          frequency_type,
          interval_hours: interval_hours || null,
          posts_per_day: posts_per_day || null,
          scheduled_times: scheduled_times || [],
          start_date,
          end_date: end_date || null,
          require_email_confirmation: !!require_email_confirmation,
          global_text: global_text || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;

    // Fetch selected product/category data to enrich webhook payload
    let productData = null;
    if (source_type === 'product' && product_id) {
      const { data } = await supabase
        .from('Product')
        .select('id, name, slug, price, comparePrice, imageUrl, featured')
        .eq('id', product_id)
        .single();
      productData = data;
    }

    let categoryData = null;
    if (source_type === 'category' && category_id) {
      const { data } = await supabase
        .from('Category')
        .select('id, name, slug')
        .eq('id', category_id)
        .single();
      categoryData = data;
    }

    // Build the n8n webhook payload
    const webhookPayload = {
      trigger: 'settings_saved',
      timestamp: new Date().toISOString(),
      settings: {
        is_active,
        source_type,
        only_promo,
        frequency_type,
        interval_hours: interval_hours || null,
        posts_per_day: posts_per_day || null,
        scheduled_times: scheduled_times || [],
        start_date,
        end_date: end_date || null,
        require_email_confirmation,
        global_text: global_text || '',
      },
      product: productData,
      category: categoryData,
    };

    // Log the webhook call
    await supabase.from('auto_post_logs').insert({
      product_id: productData?.id || null,
      product_name: productData?.name || (source_type === 'random' ? 'Random Product' : null),
      product_price: productData?.price || null,
      generated_text: null,
      status: 'pending',
      scheduled_time: new Date().toISOString(),
      webhook_payload: webhookPayload,
    });

    // Fire n8n webhook
    if (N8N_WEBHOOK_URL) {
      try {
        const webhookRes = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        console.log('[n8n webhook] status:', webhookRes.status);
      } catch (webhookErr) {
        console.error('[n8n webhook] failed to call:', webhookErr);
        // Don't fail the API response if webhook fails
      }
    } else {
      console.warn('[n8n webhook] N8N_WEBHOOK_URL not configured');
    }

    return NextResponse.json({
      success: true,
      settings,
      webhook_payload: webhookPayload,
    });
  } catch (error) {
    console.error('[auto-post/settings POST]', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
