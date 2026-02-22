const express = require('express');
const router = express.Router();
const {
  getAllSensorData,
  getSensorDataByBin,
  getLatestSensorData,
  addSensorData,
  deleteSensorData
} = require('../controllers/sensorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllSensorData);
router.get('/latest', protect, getLatestSensorData);
router.get('/bin/:binId', protect, getSensorDataByBin);
router.post('/', protect, addSensorData);
router.delete('/:id', protect, deleteSensorData);

module.exports = router;