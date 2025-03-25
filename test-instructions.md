# 1PoundBid System Testing Instructions

## Prerequisites
1. Ensure you have the `.env` file with valid Supabase credentials
2. Make sure the application is running (`npm run dev`)

## Testing the Box Full Button

### Step 1: Navigate to a Customer with Items in Box
1. Go to the Dashboard
2. Use the search function to find a customer with items in "in_box" status
   - If none exist, you can scan items into box status first
3. Click on the customer to go to their details page

### Step 2: Process the Box
1. Verify there are items with "in_box" status in the customer's orders
2. Click the "Box Full" button
3. In the modal:
   - Select a box type (e.g., "Small Box")
   - Enter a weight (e.g., "2.5")
4. Click "Submit"

### Step 3: Verify Results
1. Check that the items previously in "in_box" status are now "shipped"
2. Scroll down to the "Boxes Sent Out" section
   - Verify a new box entry appears with the correct:
     - Box type
     - Weight
     - Items list
     - Timestamp
3. Go back to the Dashboard
4. Check the "Boxes Ready for Delivery" section
   - Verify the same box appears here with all the correct information

## Testing SMS Replies

### Step 1: Generate Test SMS Replies
1. Run the test data generator script to create sample SMS replies
   - `node test-data-generator.js`
   - Or manually insert test data into the `sms_replies` table

### Step 2: View SMS Replies
1. Navigate to the Customer Inquiries page
2. Look for the "SMS Replies" section
3. Verify that the test SMS replies are displayed
4. Check that unread messages are highlighted

### Step 3: Test Functionality
1. Click the "Mark as read" button on an unread message
2. Verify the message styling changes to indicate it's been read
3. If Twilio is configured, test sending an SMS:
   - Enter a message in the SMS composition section
   - Select a recipient or enter a phone number
   - Click "Send SMS"
   - Verify the message is sent without errors

## Testing Box Archiving

### Step 1: Find a Box to Archive
1. Go to the Dashboard
2. Locate a box in the "Boxes Ready for Delivery" section

### Step 2: Archive the Box
1. Click the Archive button (folder icon) on the box
2. Verify the box disappears from the Dashboard

### Step 3: Verify Archiving
1. Navigate to the Archived Boxes page
2. Verify the box you archived appears in the list
3. Check that all the box details are correct

## Reporting Issues
If you encounter any issues during testing:
1. Note the exact steps to reproduce the problem
2. Capture any error messages displayed
3. Document the expected vs. actual behavior
4. Report the issue with all relevant details