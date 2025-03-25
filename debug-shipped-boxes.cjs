// Debug script for shipped boxes functionality (CommonJS version)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugShippedBoxes() {
  console.log('Debugging shipped boxes functionality...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...');

  try {
    // 1. Check if the shipped_boxes table exists
    console.log('\nChecking if shipped_boxes table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('shipped_boxes')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Error accessing shipped_boxes table:', tableError);
      console.log('This could indicate the table does not exist or you do not have permission to access it.');
    } else {
      console.log('✅ shipped_boxes table exists and is accessible');
    }

    // 2. Check if the shipped_box_items table exists
    console.log('\nChecking if shipped_box_items table exists...');
    const { data: itemsTableInfo, error: itemsTableError } = await supabase
      .from('shipped_box_items')
      .select('id')
      .limit(1);

    if (itemsTableError) {
      console.error('Error accessing shipped_box_items table:', itemsTableError);
      console.log('This could indicate the table does not exist or you do not have permission to access it.');
    } else {
      console.log('✅ shipped_box_items table exists and is accessible');
    }

    // 3. Check if there are any shipped boxes
    console.log('\nChecking for existing shipped boxes...');
    const { data: boxes, error: boxesError } = await supabase
      .from('shipped_boxes')
      .select('*')
      .order('created_at', { ascending: false });

    if (boxesError) {
      console.error('Error fetching shipped boxes:', boxesError);
    } else {
      console.log(`Found ${boxes.length} shipped boxes`);
      if (boxes.length > 0) {
        console.log('Sample box:', boxes[0]);
      }
    }

    // 4. Check if there are any shipped box items
    console.log('\nChecking for existing shipped box items...');
    const { data: boxItems, error: boxItemsError } = await supabase
      .from('shipped_box_items')
      .select('*')
      .limit(10);

    if (boxItemsError) {
      console.error('Error fetching shipped box items:', boxItemsError);
    } else {
      console.log(`Found ${boxItems.length} shipped box items`);
      if (boxItems.length > 0) {
        console.log('Sample box item:', boxItems[0]);
      }
    }

    // 5. Try the exact query used in the application
    console.log('\nTrying the exact query used in the application...');
    const { data: boxesData, error: boxesQueryError } = await supabase
      .from('shipped_boxes')
      .select(`
        id,
        type,
        weight,
        created_at,
        archived,
        customer:customer_id (
          id,
          first_name,
          last_name,
          bidder_number
        ),
        shipped_box_items!inner (
          order:order_id (
            id,
            item_code,
            item_name,
            processed_at
          )
        )
      `)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (boxesQueryError) {
      console.error('Error with the exact query:', boxesQueryError);
      
      // Try a simpler query to isolate the issue
      console.log('\nTrying a simpler query...');
      const { data: simpleData, error: simpleError } = await supabase
        .from('shipped_boxes')
        .select(`
          id,
          type,
          weight,
          created_at,
          archived,
          customer_id
        `)
        .eq('archived', false)
        .order('created_at', { ascending: false });
        
      if (simpleError) {
        console.error('Error with simpler query:', simpleError);
      } else {
        console.log('Simpler query succeeded:', simpleData.length > 0 ? 'Data found' : 'No data found');
        if (simpleData.length > 0) {
          console.log('Sample data:', simpleData[0]);
        }
      }
      
      // Check if the archived column exists
      console.log('\nChecking if archived column exists in shipped_boxes...');
      const { data: columnInfo, error: columnError } = await supabase
        .from('shipped_boxes')
        .select('archived')
        .limit(1);
        
      if (columnError) {
        console.error('Error checking archived column:', columnError);
      } else {
        console.log('✅ archived column exists');
      }
    } else {
      console.log('✅ Full query succeeded!');
      console.log(`Found ${boxesData.length} boxes with the full query`);
      if (boxesData.length > 0) {
        console.log('Sample result:', JSON.stringify(boxesData[0], null, 2));
      }
    }

    // 6. Generate test data if no boxes exist
    if (boxes.length === 0) {
      console.log('\nNo shipped boxes found. Would you like to generate test data? (Run node test-data-generator.js)');
    }

  } catch (error) {
    console.error('Unexpected error during debugging:', error);
  }
}

debugShippedBoxes().catch(console.error);