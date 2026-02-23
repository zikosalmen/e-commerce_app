import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Upload a product image to Supabase Storage
 * @param file - The file to upload
 * @param productId - The product ID for unique naming
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY to .env.local');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteProductImage(url: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }


  const urlParts = url.split('/products/');
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL');
  }

  const filePath = `products/${urlParts[1]}`;

  const { error } = await supabase.storage
    .from('products')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}


export async function uploadMultipleImages(
  files: File[],
  productId: string
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadProductImage(file, productId));
  return Promise.all(uploadPromises);
}
