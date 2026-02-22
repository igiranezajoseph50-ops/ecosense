const CollectionSchedule = require('../models/CollectionSchedule');
const Bin = require('../models/Bin');
const User = require('../models/User');

// @desc    Get all schedules
// @route   GET /api/schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await CollectionSchedule.find()
      .populate('bin', 'binId location status fillLevel')
      .populate('driver', 'name email role');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single schedule
// @route   GET /api/schedules/:id
const getScheduleById = async (req, res) => {
  try {
    const schedule = await CollectionSchedule.findById(req.params.id)
      .populate('bin', 'binId location status fillLevel')
      .populate('driver', 'name email role');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schedules by driver
// @route   GET /api/schedules/driver/:driverId
const getSchedulesByDriver = async (req, res) => {
  try {
    const driver = await User.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const schedules = await CollectionSchedule.find({ driver: req.params.driverId })
      .populate('bin', 'binId location status fillLevel')
      .sort({ scheduledDate: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schedules by status
// @route   GET /api/schedules/status/:status
const getSchedulesByStatus = async (req, res) => {
  try {
    const schedules = await CollectionSchedule.find({ status: req.params.status })
      .populate('bin', 'binId location status fillLevel')
      .populate('driver', 'name email role')
      .sort({ scheduledDate: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new schedule
// @route   POST /api/schedules
const createSchedule = async (req, res) => {
  try {
    const { bin, driver, scheduledDate, notes } = req.body;

    // Check if bin exists
    const binExists = await Bin.findById(bin);
    if (!binExists) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    // Check if driver exists
    const driverExists = await User.findById(driver);
    if (!driverExists) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const schedule = await CollectionSchedule.create({
      bin,
      driver,
      scheduledDate,
      notes
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update schedule status
// @route   PUT /api/schedules/:id
const updateSchedule = async (req, res) => {
  try {
    const schedule = await CollectionSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updatedSchedule = await CollectionSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('bin', 'binId location status fillLevel')
     .populate('driver', 'name email role');

    // If schedule completed, reset bin fill level
    if (req.body.status === 'completed') {
      await Bin.findByIdAndUpdate(schedule.bin, {
        fillLevel: 0,
        weight: 0,
        status: 'green'
      });
    }

    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await CollectionSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getSchedulesByDriver,
  getSchedulesByStatus,
  createSchedule,
  updateSchedule,
  deleteSchedule
};