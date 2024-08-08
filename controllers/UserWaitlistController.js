// controllers/userWaitlistController.js
const UserWaitlist = require('../models/UserWaitlistModel');
const Joi = require('joi');

const addToWaitlist = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;

    const newWaitlistEntry = new UserWaitlist({ email });
    await newWaitlistEntry.save();

    res.status(201).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addToWaitlist
};
