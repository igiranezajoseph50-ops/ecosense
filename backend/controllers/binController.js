const Bin = require('../models/Bin');

// @desc    Get all bins
// @route   GET /api/bins
const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bin
// @route   GET /api/bins/:id
const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new bin
// @route   POST /api/bins
const createBin = async (req, res) => {
  try {
    const { binId, location, fillLevel, weight, gasLevel, status } = req.body;

    // Check if binId already exists
    const binExists = await Bin.findOne({ binId });
    if (binExists) {
      return res.status(400).json({ message: 'Bin ID already exists' });
    }

    const bin = await Bin.create({
      binId,
      location,
      fillLevel,
      weight,
      gasLevel,
      status
    });

    res.status(201).json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bin
// @route   PUT /api/bins/:id
const updateBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    const updatedBin = await Bin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedBin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bin
// @route   DELETE /api/bins/:id
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    await bin.deleteOne();
    res.json({ message: 'Bin removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bins by status
// @route   GET /api/bins/status/:status
const getBinsByStatus = async (req, res) => {
  try {
    const bins = await Bin.find({ status: req.params.status });
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  getBinsByStatus
};