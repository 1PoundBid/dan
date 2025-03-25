import { createClient } from '@supabase/supabase-js';

// Live database
const liveSupa = createClient(
  'https://wdahgclackfaifkhrell.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYWhnY2xhY2tmYWlma2hyZWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NzI5NzMsImV4cCI6MjA1MzI0ODk3M30.q6HiA2Kk385MSKhLdxKOq-IroSREZY5jWJh-9260WjA'
);

async function getDatabaseSizes() {
  console.log('Checking database sizes...\n');

  // Check live database
  console.log('Live Database (wdahgclackfaifkhrell):');
  
  try {
    // Get customers count
    const { count: customerCount } = await liveSupa
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get orders count  
    const { count: orderCount } = await liveSupa
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get shipped boxes count
    const { count: boxCount } = await liveSupa
      .from('shipped_boxes')
      .select('*', { count: 'exact', head: true });

    console.log(`Customers: ${customerCount || 0}`);
    console.log(`Orders: ${orderCount || 0}`);
    console.log(`Shipped Boxes: ${boxCount || 0}`);
    
  } catch (error) {
    console.error('Error checking live database:', error);
  }
}

getDatabaseSizes();