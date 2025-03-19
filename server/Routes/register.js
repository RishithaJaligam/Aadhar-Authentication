const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const apiKey = process.env.API_KEY; // Ensure your API key is set in .env

// Route to generate OTP
router.post('/register', async (req, res) => {
  const { name, aadhaarNumber, consent } = req.body;
console.log(req.body);
  try {
    // Send request to the Gridlines API to generate OTP
    const response = await axios.post('https://api.gridlines.io/aadhaar-api/boson/generate-otp', {
      aadhaar_number: aadhaarNumber,
      consent: consent
    }, {
      headers: {
        'X-Auth-Type': 'API-Key', // Set the auth type
        'X-API-Key': `${apiKey}`, // Set the API key
        'Content-Type': 'application/json' // Set the content type
      }
    });
console.log(response.data);
    // Handle the response from the API
    if (response.data.data.code =='1001') {
      res.status(200).json({
        message: 'OTP sent to your registered mobile number. Check your mobile.',
        transactionId: response.data.data.transaction_id // Make sure to capture transactionId from the response
      });
    } else if (response.data.data.code === '1008') {
      res.status(400).json({ message: 'Aadhaar number does not have a mobile number registered with it.' });
    } else if (response.data.data.code === '1011') {
      res.status(400).json({ message: 'Exceeded maximum OTP generation limit. Please try again later.' });
    } else if (response.data.data.code === '1012') {
      res.status(400).json({ message: 'Aadhaar number does not exist.' });
    } else if (response.data.data.code === 'INVALID_AADHAAR') {
      res.status(400).json({ message: 'Invalid Aadhaar Number.' });
    } else if (response.data.data.code === 'OTP_ALREADY_SENT') {
      res.status(400).json({ message: 'OTP already sent. Please try after 60 seconds.' });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }
  } catch (error) {
    console.error('Error generating OTP:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error generating OTP', error: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
