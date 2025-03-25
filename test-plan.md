# 1PoundBid System Test Plan

## 1. Environment Setup
- Verify Supabase connection is working
- Ensure all required tables exist and are accessible
- Check that the application loads without errors

## 2. Customer Management Tests
- Search for existing customers
- View customer details
- Verify customer order history displays correctly

## 3. Order Processing Tests
- Test "Item Lookup" scanning functionality
- Test "Scan to Tray" functionality
- Test "Scan to Box" functionality
- Verify items change status correctly when scanned

## 4. Box Full Button Test
1. Navigate to a customer with items in "in_box" status
2. Click the "Box Full" button
3. Verify the modal appears with box type and weight fields
4. Select a box type and enter a weight
5. Submit the form
6. Verify:
   - Items change from "in_box" to "shipped" status
   - A new box record appears in the "Boxes Sent Out" section
   - The same box appears on the Dashboard in "Boxes Ready for Delivery"
   - All items are correctly associated with the box
   - Timestamps are recorded properly

## 5. SMS Replies Test
1. Navigate to the Customer Inquiries page
2. Verify the SMS Replies section is visible
3. Check if any existing SMS replies are displayed
4. Test marking a reply as read (if available)
5. Test sending an SMS (if Twilio is configured)

## 6. Box Orders Test
1. Navigate to the Box Orders page
2. Verify existing box orders are displayed
3. Test deleting a box order

## 7. Archive Box Test
1. On the Dashboard, find a box in "Boxes Ready for Delivery"
2. Click the Archive button
3. Verify the box disappears from the Dashboard
4. Navigate to Archived Boxes page
5. Verify the box appears in the archived list

## 8. Error Handling Tests
- Test with invalid barcodes
- Test with missing required fields
- Verify appropriate error messages are displayed

## Expected Results
- All functionality should work without errors
- Data should be correctly saved and retrieved from Supabase
- UI should update in real-time to reflect changes
- Error messages should be clear and helpful