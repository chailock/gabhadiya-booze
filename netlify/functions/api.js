const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Your PayFast/Ozow code here (same as server.js)
const PAYFAST_SANDBOX = true;
const PAYFAST_MERCHANT_ID = '10000100';
const PAYFAST_MERCHANT_KEY = '46f0cd694581a';

app.post('/api/payfast/initiate', (req, res) => {
  // Your PayFast code from before (minimal version)
  const paymentData = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: 'https://boozebuzz.netlify.app/success',
    cancel_url: 'https://boozebuzz.netlify.app/cancel',
    notify_url: 'https://your-netlify-site.netlify.app/.netlify/functions/api/payfast/notify',
    m_payment_id: req.body.orderId || 'BB_' + Date.now(),
    amount: parseFloat(req.body.amount).toFixed(2),
    item_name: 'BoozeBuzz Order',
    name_first: 'Customer',
    cell_number: req.body.phone || '0821234567'
  };

  // Simple signature (raw)
  let str = '';
  Object.keys(paymentData).sort().forEach(key => {
    str += `${key}=${paymentData[key]}&`;
  });
  str = str.slice(0, -1);
  paymentData.signature = require('crypto').createHash('md5').update(str).digest('hex');

  const form = new URLSearchParams(paymentData).toString();
  const url = PAYFAST_SANDBOX ? 'https://sandbox.payfast.co.za/eng/process?' + form : 'https://www.payfast.co.za/eng/process?' + form;

  res.json({ url });
});

app.post('/api/payfast/notify', (req, res) => {
  console.log('Notification:', req.body);
  res.sendStatus(200);
});

module.exports.handler = serverless(app);