
const { Console } = require('winston/lib/winston/transports');
const Question = require('../models/QuestionModel'); 
const QuestionSubCategory = require('../models/QuestionSubCategoryModel'); 
const Joi = require('joi');

// Controller to create a new question
const createQuestion = async (req, res) => {
  try {
    console.log("here");
    const schema = Joi.object({
        questionType: Joi.string().required(),
        questionSubType: Joi.string().required(),
        question: Joi.string().required(),
        premium: Joi.string().required(),
        questionOrder: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);


      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    const { questionType, questionSubType, question, premium, questionOrder } = req.body;

    // Check if required fields are empty
    if (!questionType) {
      return res.status(400).json({ error: 'Question type is required' });
    }
    if (!questionSubType) {
      return res.status(400).json({ error: 'Question subtype is required' });
    }
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!questionOrder) {
        return res.status(400).json({ error: 'Question Order is required' });
      }
      
      const existingQuestion = await Question.findOne({ questionType, questionSubType, questionOrder });
      if (existingQuestion) {
        return res.status(400).json({ error: 'Question order already exists for the same type and subtype' });
      }

    const newQuestion = new Question({
      questionType,
      questionSubType,
      question,
      premium,
      questionOrder,
    });

    await newQuestion.save();

    res.status(200).json({ status: 200, message: 'Question created successfully', data: newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getQuestionById = async (req, res) => {
  const { id } = req.params;

  console.log("id");
  console.log(id);

  try {
    const question = await Question.findById(id);

    if (!question) {
      console.log("error")
      return res.status(404).json({ error: 'Question not found' });
    }

    console.log("AFTER");
    console.log(question);

    res.status(200).json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ status: 200, data: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get questions by subtype
const getQuestionsBySubtype = async (req, res) => {
  try {
    const { subtype } = req.params;
    const questions = await Question.find({ questionSubtype: subtype });
    res.json({ status: 200, data: questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ status: 200, message: 'Question deleted successfully', data: deletedQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUniqueQuestionSubTypes = async (req, res) => {
  try {
      const { questionType } = req.params;
      if (!questionType) {
          return res.status(400).json({ error: 'questionType query parameter is required' });
      }

      // Aggregate unique questionSubTypes
      const uniqueSubTypes = await Question.aggregate([
          { $match: { questionType: questionType } },
          { $group: { _id: '$questionSubType' } },
          { $sort: { _id: 1 } }
      ]);

      // Extract the questionSubType values from the aggregation result
      const subTypes = uniqueSubTypes.map(item => item._id);

      return res.status(200).json({ data: subTypes });
  } catch (error) {
      console.error('Error fetching unique questionSubTypes:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: 'category query parameter is required' });
    }

    // Fetch subcategories by category and sort by order
    const subCategories = await QuestionSubCategory.find({ category })
      .sort({ order: 1 })
      .exec();

    return res.status(200).json(subCategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { createQuestion, getAllQuestions, getQuestionsBySubtype, deleteQuestion, getQuestionById,getUniqueQuestionSubTypes,getSubCategoriesByCategory };
