import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ccjiwkhbxmklzpkiktun.supabase.co';
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaml3a2hieG1rbHpwa2lrdHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkzNjI3MCwiZXhwIjoyMDg2NTEyMjcwfQ.RvsHpFTNx8NCZhIYLJ112Mj3zbd2TTckYaAw2sAzEPo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const updates = [
    { id: 'cat_electronique_001', name: 'Électronique', slug: 'electronique', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800' },
    { id: 'cat_accessoires_001', name: 'Accessoires', slug: 'accessoires', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800' },
    { id: 'cat_audio_001', name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800' },
    { id: 'cat_smartphones_001', name: 'Caméras', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800' }
  ];
d
  for (const up of updates) {
    await supabase.from('Category').update({ name: up.name, slug: up.slug, image: up.image }).eq('id', up.id);
  }

  console.log('Categories renamed & images set successfully');
}
main();
