// controllers/UserController.js

const UserCheck = require('../models/UserCheckModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createCheck = async (req, res) => {
  try {
    // Validate input using Joi
   
    const { projectId, userId, section } = req.body;


    
    let userCheck = await UserCheck.findOne({ projectId, userId, pageSection:section });

    console.log(req.body);
    console.log(userCheck);
    
   
    if (!userCheck) {
    const newUserCheck = new UserCheck({
      projectId,
      userId,
      pageSection:section,
    });
    console.log(newUserCheck);
    await newUserCheck.save();
    console.log("new guy");
    res.json({ status: 200, message: 'Success',check: "0", data: newUserCheck });
    }else{
      console.log("old guy");
      res.json({ status: 200, message: 'Success',check: "1",data:userCheck});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    createCheck,
};
