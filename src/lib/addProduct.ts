import { supabase } from './supabase';

export const addOrganicCarrots = async () => {
  const product = {
    name: 'Organic Carrots',
    price: 1.49,
    image_url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    description: 'Crunchy, sweet carrots grown without pesticides.',
    category: 'vegetable' as const
  };

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    console.log('Product added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}; 