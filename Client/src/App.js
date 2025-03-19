import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  // Function to handle OTP request
 // In your register function
const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/register', {
      name: name,
      aadhaarNumber: aadhaarNumber,
      consent: 'Y' // or 'N' based on user input
    });
    setTransactionId(response.data.transactionId);
    setOtpSent(true);
    alert(response.data.message);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    alert('Error sending OTP. Please try again.');
  }
};

  // Function to verify OTP
  const handleSubmitOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify', {
        otp: otp, // The OTP entered by the user
        transactionId: transactionId, // The transaction ID received during registration
        // The share code (if any)
        includeXml: true // Set to true if you want to include XML data
      });
      alert('OTP verified successfully!');
      console.log(response.data); // Handle the response data
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      alert('Error verifying OTP. Please try again.');
    }
  };
  

  return (
    <div className="App">
      <h1>Aadhaar Authentication</h1>
      
      {!otpSent ? (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
          />
          <button onClick={handleRegister}>Send OTP</button>
        </div>
      ) : !verified ? (
        <div>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleSubmitOtp }>Verify OTP</button>
        </div>
      ) : (
        <h2>User successfully registered and verified!</h2>
      )}
    </div>
  );
}

export default App;