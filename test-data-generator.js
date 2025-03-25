// This script generates test data for the 1PoundBid system
// Run with: node test-data-generator.js

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

async function generateTestData() {
  console.log('Generating test data for 1PoundBid system...');

  try {
    // Create test customers
    const customers = [
      {
        bidder_number: 'BID001',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        balance: 250.00
      },
      {
        bidder_number: 'BID002',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.j@example.com',
        balance: 175.50
      },
      {
        bidder_number: 'BID003',
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'mbrown@example.com',
        balance: 425.75
      }
    ];

    console.log('Creating test customers...');
    for (const customer of customers) {
      const { data, error } = await supabase
        .from('customers')
        .upsert(customer, { onConflict: 'bidder_number' })
        .select();

      if (error) {
        console.error('Error creating customer:', error);
        continue;
      }

      const customerId = data[0].id;
      console.log(`Created customer: ${data[0].first_name} ${data[0].last_name}`);

      // Create orders for each customer
      const orderStatuses = ['unprocessed', 'in_tray', 'in_box', 'shipped'];
      const orders = [];

      // Generate 5 orders per customer with different statuses
      for (let i = 0; i < 5; i++) {
        orders.push({
          customer_id: customerId,
          recorded_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          item_code: `ITEM-${Math.floor(Math.random() * 10000)}`,
          item_name: `Test Item ${i + 1}`,
          quantity: 1,
          debit: (Math.random() * 50 + 10).toFixed(2),
          credit: 0,
          status: orderStatuses[i % orderStatuses.length]
        });
      }

      console.log(`Creating orders for ${data[0].first_name} ${data[0].last_name}...`);
      for (const order of orders) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert(order);

        if (orderError) {
          console.error('Error creating order:', orderError);
        }
      }

      // Create storage items
      const storageItems = [
        {
          customer_id: customerId,
          type: 'bag_cage'
        },
        {
          customer_id: customerId,
          type: 'box_shelf'
        }
      ];

      console.log(`Creating storage items for ${data[0].first_name} ${data[0].last_name}...`);
      for (const item of storageItems) {
        const { error: storageError } = await supabase
          .from('storage_items')
          .insert(item);

        if (storageError) {
          console.error('Error creating storage item:', storageError);
        }
      }

      // Create a shipped box for each customer
      const shippedBox = {
        customer_id: customerId,
        type: 'small',
        weight: (Math.random() * 5 + 1).toFixed(2),
        price: 7.99,
        archived: false
      };

      const { data: boxData, error: boxError } = await supabase
        .from('shipped_boxes')
        .insert(shippedBox)
        .select()
        .single();

      if (boxError) {
        console.error('Error creating shipped box:', boxError);
      } else {
        // Associate some orders with the box
        const shippedOrders = orders.filter(o => o.status === 'shipped');
        for (const order of shippedOrders) {
          const { error: boxItemError } = await supabase
            .from('shipped_box_items')
            .insert({
              box_id: boxData.id,
              order_id: order.id
            });

          if (boxItemError) {
            console.error('Error creating box item:', boxItemError);
          }
        }
      }
    }

    // Create test box orders
    const boxOrders = [
      {
        customer_name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        box_type: 'small',
        price: 3.99,
        status: 'new'
      },
      {
        customer_name: 'Emma Davis',
        email: 'emma.davis@example.com',
        box_type: 'medium',
        price: 7.99,
        status: 'processing'
      },
      {
        customer_name: 'James Taylor',
        email: 'james.taylor@example.com',
        box_type: 'big',
        price: 9.99,
        status: 'shipped'
      }
    ];

    console.log('Creating test box orders...');
    for (const order of boxOrders) {
      const { error } = await supabase
        .from('box_orders')
        .insert(order);

      if (error) {
        console.error('Error creating box order:', error);
      }
    }

    // Create test customer inquiries
    const inquiries = [
      {
        customer_name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+1234567890',
        question: 'When will my items be shipped?',
        priority: 'medium',
        status: 'new'
      },
      {
        customer_name: 'Lisa Anderson',
        email: 'lisa.anderson@example.com',
        phone: '+1987654321',
        question: 'Can I change my shipping address?',
        priority: 'high',
        status: 'in_progress'
      }
    ];

    console.log('Creating test customer inquiries...');
    for (const inquiry of inquiries) {
      const { error } = await supabase
        .from('customer_inquiries')
        .insert(inquiry);

      if (error) {
        console.error('Error creating customer inquiry:', error);
      }
    }

    // Create test SMS replies
    const smsReplies = [
      {
        from_number: '+1234567890',
        to_number: '+1987654321',
        message: 'Yes, my items arrived today. Thank you!',
        read: false
      },
      {
        from_number: '+1987654321',
        to_number: '+1234567890',
        message: 'When will my next box be ready?',
        read: true
      }
    ];

    console.log('Creating test SMS replies...');
    for (const reply of smsReplies) {
      const { error } = await supabase
        .from('sms_replies')
        .insert(reply);

      if (error) {
        console.error('Error creating SMS reply:', error);
      }
    }

    console.log('Test data generation complete!');
  } catch (error) {
    console.error('Error generating test data:', error);
  }
}

generateTestData().catch(console.error);