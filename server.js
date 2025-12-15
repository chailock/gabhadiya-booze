const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PayFast Sandbox (FREE - no signup)
const PAYFAST_URL = 'https://sandbox.payfast.co.za/eng/process';
const MERCHANT_ID = '10000100';
const MERCHANT_KEY = '46f0cd694581a';
const PASS_PHRASE = 'iforgot';

app.post('/api/payfast/initiate', (req, res) => {
  console.log('🛒 Checkout:', req.body);

  const { amount, phone, orderId, address } = req.body;

  const payfastData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
    notify_url: 'http://localhost:5000/api/payfast/notify',
    name_first: 'BoozeBuzz',
    email_address: phone + '@boozebuzz.co.za',
    m_payment_id: orderId,
    amount: (parseFloat(amount) || 0).toFixed(2),
    item_name: 'BoozeBuzz Order #' + orderId,
    item_description: address
  };

  console.log('✅ PayFast Data:', payfastData);
  res.json({ url: PAYFAST_URL, data: payfastData });
});

app.post('/api/payfast/notify', (req, res) => {
  console.log('🔔 PayFast NOTIFICATION:', req.body);
  if (req.body.payment_status === 'COMPLETE') {
    console.log('✅ PAYMENT SUCCESS:', req.body.m_payment_id);
  }
  res.send('OK');
});

// ✅ PAYFAST REDIRECT PAGES (MUST be on port 3000)
app.get('/success', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Success</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px; background: #d4edda;">
        <h1 style="color: #155724;">✅ PAYMENT SUCCESS!</h1>
        <p>Thank you for your order! Delivery details sent to your phone.</p>
        <p><a href="javascript:window.close()" style="color: #155724; font-size: 18px;">← Close & Continue Shopping</a></p>
      </body>
    </html>
  `);
});

app.get('/cancel', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px; background: #f8d7da;">
        <h1 style="color: #721c24;">❌ Payment Cancelled</h1>
        <p>No charge made to your account.</p>
        <p><a href="javascript:window.close()" style="color: #721c24; font-size: 18px;">← Return to Store</a></p>
      </body>
    </html>
  `);
});

app.get('/', (req, res) => res.send('🚀 BoozeBuzz PayFast Server Running!'));
app.get('/test', (req, res) => res.json({ message: '✅ Backend 100% READY!' }));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📱 Test: http://localhost:${PORT}/test`);
  console.log(`✅ Success: http://localhost:${PORT}/success`);
});
