const SensorData = require('../models/SensorData');
const Bin = require('../models/Bin');

// @desc    Get all sensor data
// @route   GET /api/sensors
const getAllSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.find().populate('bin', 'binId location status');
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sensor data for a specific bin
// @route   GET /api/sensors/bin/:binId
const getSensorDataByBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.binId);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    const sensorData = await SensorData.find({ bin: req.params.binId })
      .sort({ recordedAt: -1 })
      .limit(50);

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest sensor data for all bins
// @route   GET /api/sensors/latest
const getLatestSensorData = async (req, res) => {
  try {
    const bins = await Bin.find();

    const latestData = await Promise.all(
      bins.map(async (bin) => {
        const latest = await SensorData.findOne({ bin: bin._id })
          .sort({ recordedAt: -1 });
        return { bin: bin.binId, location: bin.location, data: latest };
      })
    );

    res.json(latestData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new sensor data
// @route   POST /api/sensors
const addSensorData = async (req, res) => {
  try {
    const { bin, fillLevel, weight, gasLevel, temperature } = req.body;

    // Check if bin exists
    const binExists = await Bin.findById(bin);
    if (!binExists) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    // Create sensor data
    const sensorData = await SensorData.create({
      bin,
      fillLevel,
      weight,
      gasLevel,
      temperature
    });

    // Auto update bin status based on fill level
    let status = 'green';
    if (fillLevel >= 50 && fillLevel < 80) status = 'yellow';
    if (fillLevel >= 80) status = 'red';

    await Bin.findByIdAndUpdate(bin, {
      fillLevel,
      weight,
      gasLevel,
      status
    });

    res.status(201).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sensor data
// @route   DELETE /api/sensors/:id
const deleteSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.findById(req.params.id);
    if (!sensorData) {
      return res.status(404).json({ message: 'Sensor data not found' });
    }

    await sensorData.deleteOne();
    res.json({ message: 'Sensor data removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSensorData,
  getSensorDataByBin,
  getLatestSensorData,
  addSensorData,
  deleteSensorData
};