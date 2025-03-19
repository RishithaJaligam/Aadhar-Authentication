const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const apiKey = process.env.API_KEY; // Ensure your API key is set in .env

// Route to submit OTP
router.post('/verify', async (req, res) => {
  const { otp, transactionId, shareCode, includeXml } = req.body; // Expecting these fields in the request body
  console.log(otp, transactionId)

  try {
    // Send request to the Gridlines API to submit the OTP
    const response = await axios.post('https://api.gridlines.io/aadhaar-api/boson/submit-otp', {
      otp: otp, // Include the OTP sent to the user's mobile
      transaction_id: transactionId, // Include the transaction ID from the previous request
      
    }, {
      headers: {
        'X-Auth-Type': 'API-Key', // Set the auth type
        'X-Transaction-ID': transactionId, // Set the transaction ID
        'X-API-Key': `${apiKey}`, // Set the API key
        'Content-Type': 'application/json' // Set the content type
      }
    });

    // Handle the response from the API
    if (response.data.data.code=== '1002') {
      res.status(200).json({
        success:true,
        message: 'XML validated and parsed.',
        data: response.data.data // Assuming the returned data contains the Aadhaar information
      });
    } else if (response.data.data.code === '1003') {
      res.status(400).json({ message: 'Session Expired. Please start the process again.' });
    } else if (response.data.data.code === '1005') {
      res.status(400).json({ message: 'OTP attempts exceeded. Please start the process again.' });
    } else if (response.data.data.code === 'INVALID_OTP') {
      res.status(400).json({ message: 'Invalid OTP.' });
    } else if (response.data.data.code === 'NO_SHARE_CODE') {
      res.status(400).json({ message: 'No share code provided.' });
    } else if (response.data.data.code === 'WRONG_SHARE_CODE') {
      res.status(400).json({ message: 'Wrong share code.' });
    } else if (response.data.data.code === 'INVALID_SHARE_CODE') {
      res.status(400).json({ message: 'Invalid share code. Length should be 4 and should only contain numbers.' });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }
  } catch (error) {
    console.error('Error submitting OTP:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error submitting OTP', error: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
