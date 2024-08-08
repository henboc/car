const User = require('../models/UserModel');
const Finished = require('../models/FinishedSubCategoryModel');
const QuestionSubCategory = require('../models/QuestionSubCategoryModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const createFinish = async (req, res) => {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      questionType: Joi.string().required(),
      questionSubType: Joi.string().required(),
      projectId: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    console.log(req.body);


    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { questionType, questionSubType, projectId, userId} = req.body;
    


   
   
    
    const newFinish = new Finished({
        questionType,
        questionSubType,
        projectId,
        userId,
    });
    console.log(newFinish);
    await newFinish.save();
   
    res.json({ status: 200, message: 'Success',data:{ finish: newFinish }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNextQuestion = async (req, res) => {
    const { projectId, questionType, questionSubType } = req.params;
  
    try {
      // Step 1: Fetch the last finish based on projectId and questionType
      const lastFinish = await Finished.findOne({ projectId, questionType })
        .sort({ timeSent: -1 })
        .exec();
  
      let nextQuestion;
  
      if (!lastFinish) {
        // Step 2: If no finish is found, fetch the data with order 1 and the same questionType
        nextQuestion = await QuestionSubCategory.findOne({ category: questionType, order:1 });
        console.log("nextQuestion");
        console.log(questionType);
        console.log(nextQuestion);
      } else {
        // Step 3: If a finish is found, fetch the next data based on the order from the questionSubCategories collection
        const lastOrder = await QuestionSubCategory.findOne({ subCategory: lastFinish.questionSubType }).exec();

        if (lastOrder) {
          nextQuestion = await QuestionSubCategory.findOne({
            category: questionType,
            order: lastOrder.order + 1
          }).exec();
        }
      }
  
      if (!nextQuestion) {
        return res.status(200).json({ message: 'No next question found.' });
      }
  
      res.json(nextQuestion);
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
  };
  const getFinshedByProjectId = async (req, res) => {
    try {
      const projectId = req.params.projectId; // Assuming the user ID is part of the URL parameters
      const questionType = req.params.questionType; // Assuming the user ID is part of the URL parameters
  
      // Find the user by ID in the database
      const finished = await Finished.find({projectId,questionType});
  
      // Check if the user exists
      if (!finished) {
        return res.status(404).json({ error: 'nothing not found' });
      }

      console.log(finished);
      // Return the user data in the response
      return res.status(200).json({ message: 'Successful', data:finished });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {
    createFinish,
    getNextQuestion,
    getFinshedByProjectId
  };