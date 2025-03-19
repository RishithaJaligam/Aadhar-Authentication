const express = require('express');
const bodyParser = require('body-parser');
const registerRoutes = require('./Routes/register');
const verifyOtpRoutes = require('./Routes/verifyotp');
const cors = require('cors'); // Import CORS

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', registerRoutes);
app.use('/api', verifyOtpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
