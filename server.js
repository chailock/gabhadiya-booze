const express = require('express');
const crypto = require('crypto-js');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PayFast Sandbox
const PAYFAST_SANDBOX = true;
const PAYFAST_MERCHANT_ID = '10000100';
const PAYFAST_MERCHANT_KEY = '46f0cd694581a';
const PAYFAST_PASSPHRASE = ''; // Empty in sandbox

const PAYFAST_URL = PAYFAST_SANDBOX ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

// Signature Generation - Raw values
function generatePayFastSignature(data, passphrase = '') {
  const filtered = {};
  for (const key in data) {
    if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      filtered[key] = String(data[key]).trim();
    }
  }

  const sortedKeys = Object.keys(filtered).sort();

  const str = sortedKeys.map(key => `${key}=${filtered[key]}`).join('&');

  if (passphrase && passphrase.trim() !== '') {
    str += '&passphrase=' + passphrase.trim();
  }

  return crypto.MD5(str).toString();
}

// Initiate Payment
app.post('/api/payfast/initiate', (req, res) => {
  const { amount, name = 'Customer', email = '', phone = '', orderId } = req.body;

  // Ensure required fields are present
  if (!amount || !orderId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const paymentData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
    notify_url: 'http://127.0.0.1:5000/api/payfast/notify',
    m_payment_id: orderId || 'GB_' + Date.now(),
    amount: parseFloat(amount).toFixed(2),
    item_name: 'Gabhadiya Booze Order',
    name_first: name.split(' ')[0] || 'Customer',
    cell_number: phone || ''
  };

  if (email && email.trim() !== '') {
    paymentData.email_address = email.trim();
  }

  paymentData.signature = generatePayFastSignature(paymentData, PAYFAST_PASSPHRASE);

  const formData = new URLSearchParams(paymentData).toString();
  const fullUrl = PAYFAST_URL + '?' + formData;

  console.log('Payment Data:', paymentData);
  console.log('Generated Signature:', paymentData.signature);
  console.log('Full URL:', fullUrl);

  res.json({ url: fullUrl });
});

// Notification
app.post('/api/payfast/notify', (req, res) => {
  console.log('PayFast Notification:', req.body);

  const sig = generatePayFastSignature(req.body, PAYFAST_PASSPHRASE);
  if (sig === req.body.signature) {
    if (req.body.payment_status === 'COMPLETE') {
      console.log('PAYMENT SUCCESS:', req.body.m_payment_id);
    }
  } else {
    console.log('SIGNATURE MISMATCH in notify');
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Gabhadiya Booze Payment Server Running!'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));