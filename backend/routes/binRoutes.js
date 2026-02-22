const express = require('express');
const router = express.Router();
const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  getBinsByStatus
} = require('../controllers/binController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllBins);
router.get('/status/:status', protect, getBinsByStatus);
router.get('/:id', protect, getBinById);
router.post('/', protect, createBin);
router.put('/:id', protect, updateBin);
router.delete('/:id', protect, deleteBin);

module.exports = router;