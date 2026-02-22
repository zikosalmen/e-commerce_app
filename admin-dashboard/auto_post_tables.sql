-- Auto Post Settings & Logs Tables
-- Run this in Supabase SQL Editor

-- ============================
-- 1. auto_post_settings table
-- ============================
CREATE TABLE IF NOT EXISTS public.auto_post_settings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active        boolean NOT NULL DEFAULT false,
  source_type      text NOT NULL DEFAULT 'random' CHECK (source_type IN ('product', 'category', 'random')),
  product_id       text,
  category_id      text,
  only_promo       boolean NOT NULL DEFAULT false,
  frequency_type   text NOT NULL DEFAULT 'interval' CHECK (frequency_type IN ('interval', 'daily_count')),
  interval_hours   integer,
  posts_per_day    integer,
  scheduled_times  jsonb NOT NULL DEFAULT '[]',
  start_date       date NOT NULL DEFAULT CURRENT_DATE,
  end_date         date,
  require_email_confirmation boolean NOT NULL DEFAULT false,
  global_text      text NOT NULL DEFAULT '',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Only one settings row allowed (singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS auto_post_settings_singleton ON public.auto_post_settings ((true));

-- ============================
-- 2. auto_post_logs table
-- ============================
CREATE TABLE IF NOT EXISTS public.auto_post_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     text,
  product_name   text,
  product_price  numeric,
  generated_text text,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted', 'cancelled')),
  scheduled_time timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  approved_at    timestamptz,
  webhook_payload jsonb -- full JSON sent to n8n
);

-- ============================
-- 3. RLS Policies
-- ============================
ALTER TABLE public.auto_post_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_post_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage auto_post_settings" ON public.auto_post_settings;
CREATE POLICY "Admin can manage auto_post_settings" ON public.auto_post_settings
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin can manage auto_post_logs" ON public.auto_post_logs;
CREATE POLICY "Admin can manage auto_post_logs" ON public.auto_post_logs
  FOR ALL USING (is_admin());
