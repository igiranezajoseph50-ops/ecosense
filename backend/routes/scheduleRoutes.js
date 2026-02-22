const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  getScheduleById,
  getSchedulesByDriver,
  getSchedulesByStatus,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllSchedules);
router.get('/status/:status', protect, getSchedulesByStatus);
router.get('/driver/:driverId', protect, getSchedulesByDriver);
router.get('/:id', protect, getScheduleById);
router.post('/', protect, createSchedule);
router.put('/:id', protect, updateSchedule);
router.delete('/:id', protect, deleteSchedule);

module.exports = router;