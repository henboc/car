// controllers/UserController.js
require('dotenv').config();
const Share = require('../models/ShareModel');
const User = require('../models/UserModel');
const Project = require('../models/ProjectModel');
const ReviewInvite = require('../models/ReviewInviteModal');
const Reviewer = require('../models/ReviewerModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const API_BASE_URL = require('../config');

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  // secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  // auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  // }

  service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const createLink = async (req, res) => {
  try {

    console.log(req.body);

    const { projectId, phases, userId,link,uniqueCode} = req.body;
    console.log()
    console.log(req.body);
    const newShare = new ReviewInvite({
      projectId,
      phases,
      userId,
      link,
      uniqueCode,
    });
    await newShare.save();
    res.json({ status: 200, message: 'Success',data:{ share: newShare }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const creatShareReviewUser = async (req, res) => {
  try {
    // Validate input using Joi
    const { projectId, link, email,uniqueCode,phases} = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }
    
    console.log(phases);


    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }
    

    
    const newReview = new ReviewInvite({
      projectId,
      email,
      link,
      uniqueCode,
      phases,
    });
    //console.log(newTeam);
    await newReview.save();
    newlink = API_BASE_URL+link;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sign Up for Our Service',
      text: `Click the link to sign up: ${newlink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).json({ message: 'Error sending email', error });
      }
      res.status(200).json({ message: 'Email sent', info });
  });
    
    //res.json({ status: 200, message: 'Success'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createShareUser = async (req, res) => {
    try {
      // Validate input using Joi
      const generatedPassword = generatePassword();
      const schema = Joi.object({
        link: Joi.string().required(),
        firstName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        speciality: Joi.string().required(),
        experience: Joi.string().required(),
        uniqueCode: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
  
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { firstName, link, email, speciality, experience,phoneNumber,uniqueCode} = req.body;
      
      // Check if phone number is exactly 11 characters
      if (phoneNumber.length < 11) {
        return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
      }
  
      if (phoneNumber.length > 13) {
        return res.status(400).json({
          error: 'Incorrect phone number length'
        });
      }
  
      console.log("here");
      
  
      // Check if email is in proper format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Incorrect email format' });
      }
      
  
      // Check if first name and last name are not more than 20 characters
      if (firstName.length > 20 ) {
        return res.status(400).json({ error: 'First name or last name too long' });
      }
      let id = "";
      let projectId = "";
      console.log(phoneNumber);
      const shareIndex = link.indexOf('/share');


      const existingUserLink = await ReviewInvite.findOne({ uniqueCode:uniqueCode });
      if (existingUserLink) {
         id = existingUserLink._id;
         projectId = existingUserLink.projectId;
        console.log('Existing User Link ID:', id);
      } else {
        return res.status(400).json({ error: 'Link does not exist' });
      }
  
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      const existingUserPhone = await User.findOne({ phoneNumber });
      if (existingUserPhone) {
        return res.status(400).json({ error: 'Phone Number already exists' });
      }
      
  
      // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      // console.log(password)
      // if (!passwordRegex.test(generatedPassword)) {
      //   return res.status(400).json({ error: 'Invalid password format' });
      // }
  
      
      
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      console.log(hashedPassword);
      const newUser = new User({
        firstName,
        speciality,
        email,
        phoneNumber,
        experience,
        password:hashedPassword,
        // Add other properties as needed
      });
      console.log(newUser);
      await newUser.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Sign Up for Our Service',
        text: `Your new paswword is: ${generatedPassword}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email', error });
        }
        res.status(200).json({ message: 'Email sent', info });
    });

      const access_token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

      const newReviewer = new Reviewer({
        userId:newUser._id,
        projectId,
        phases:existingUserLink.phases,
      });
      console.log(newReviewer);
      await newReviewer.save();

      await ReviewInvite.findOneAndDelete({ uniqueCode });

      res.json({ status: 200, message: 'Success',data:{ user: newReviewer, access_token }});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const getUserShare = async (req, res) => {
  try {
    const { id } = req.params;
    const Shares = await Reviewer.find({userId:id}).populate('projectId', 'projectName');
    console.log(Shares);
    res.json({ status: 200, data: Shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserShareById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("give re");
    console.log(id);
    const Shares = await Reviewer.findById(id).populate('projectId', 'projectName');
    console.log(Shares);
    res.json({ status: 200, data: Shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserShareByProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log("share");
    const Shares = await Reviewer.find({ projectId:id}).populate('projectId', 'projectName');
    console.log(Shares);
    res.json({ status: 200, data: Shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



  const generatePassword = () => {
    const length = 8;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

    const passwordChars = [
      getRandomChar(uppercase),
      getRandomChar(lowercase),
      getRandomChar(numbers),
      getRandomChar(specialChars)
    ];

    const allChars = uppercase + lowercase + numbers + specialChars;
    for (let i = passwordChars.length; i < length; i++) {
      passwordChars.push(getRandomChar(allChars));
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');

    
  };

const getPhaseByShare = async (req, res) => {
  try {
    const shareId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const share = await Share.findById(shareId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  createShareUser,
  createLink,
  getPhaseByShare,
  getUserShare,
  getUserShareByProject,
  creatShareReviewUser,
  getUserShareById
};
