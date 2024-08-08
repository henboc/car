// controllers/enteredPhaseController.js

const EnteredPhase = require('../models/EnteredPhaseModel');

const checkAndInsertEnteredPhase = async (req, res) => {
  const { projectId, phase, userId } = req.body;
  console.log("in")
  try {
    // Check if the user is already in the same project
    const existingEntry = await EnteredPhase.findOne({ projectId, userId });

    if (existingEntry) {
      return res.status(200).json({ message: 'User is already in the project', case:"in" });
    }

    // Insert new entry if not found
    const newEntry = new EnteredPhase({ projectId, phase, userId });
    await newEntry.save();

    res.status(200).json({ message: 'New entry created', data: newEntry, case:"just in" });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  checkAndInsertEnteredPhase
};
