const Answered = require('../models/AnsweredModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createAnswered = async (req, res) => {
  try {

    const { projectId, questionType, questionSubType, questionName} = req.body;

    const existingEntry = await Answered.findOne({ projectId, questionType, questionSubType });

    if (existingEntry) {
        return existingEntry;
        //res.json({ status: 200, message: 'Success',data:{ entry: existingEntry }});
    }
    const newEntry = new Answered({ projectId, questionType, questionSubType, questionName });
    await newEntry.save();
    res.json({ status: 200, message: 'Success',data:{ entry: newEntry }});
   

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAnswered = async (req, res) => {
    try {
      const projectId = req.params.id;
      const questionType = req.params.type;
  
      // Find the user by ID in the database
      const answered = await Answered.find({ projectId,questionType });
  
      // Check if the user exists
      if (!answered) {
        return res.status(404).json({ error: 'Nothing found' });
      }
  
      // Return the user data in the response
      res.json({ status: 200, message: 'Success',data:{ entry: answered }});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    createAnswered,
    getAnswered,
  };