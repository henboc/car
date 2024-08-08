const Message = require('../models/MessageModel');
const Joi = require('joi');
const User = require('../models/UserModel');
// Controller to create a new GoGate

const getChats = async (req, res) => {
    try {
      const { projectId } = req.params;
      const messages = await Message.find({ projectId }).populate('userId','first_name last_name');
      res.status(200).json({ data: messages });
      console.log(projectId);
      console.log(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {
    getChats,
  };