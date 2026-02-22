const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bins', require('./routes/binRoutes'));
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));


app.get('/', (req, res) => {
  res.json({ message: 'EcoSense Rwanda API is running...' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});