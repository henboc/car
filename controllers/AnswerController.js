const { Console } = require('winston/lib/winston/transports');
const Answer = require('../models/AnswerModel'); 
const Question = require('../models/QuestionModel'); // Adjust the path as needed // Import the Answer model
const Joi = require('joi');
// Controller to create a new answer
const createAnswer = async (req, res) => {
  try {
    console.log("here");
    // const schema = Joi.object({
    //     userId: Joi.string().required(),
    //     questionId: Joi.string().required(),
    //   });
  
    // const { error } = schema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ error: error.details[0].message });
    //   }
    const { userId, questionId, questionType, questionSubType, projectId, answer } = req.body.data;

    // Check if any of the required fields are empty
    if (!userId) {
        return res.status(400).json({ error: 'Please Login' });
      }
      if (!questionId) {
        return res.status(400).json({ error: 'No question asked' });
      }
      if (!answer) {
        return res.status(400).json({ error: 'empty Answer' });
      }

      if (!projectId) {
        return res.status(400).json({ error: 'Please Select Project' });
      }

    const newAnswer = new Answer({
      userId,
      questionId,
      questionType,
      questionSubType,
      projectId,
      answer,
    });

    await newAnswer.save();

    res.status(200).json({ status: 200, message: 'Answer added successfully', data: newAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAnswersByCriteria = async (req, res) => {
  const { projectId, questionType, questionSubType } = req.params;
  console.log('crirt');
  console.log(projectId);

  try {
    const answers = await Answer.find({
      projectId,
      questionType,
      questionSubType,
    });

    if (answers.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No answers found for the given criteria',
      });
    }

    // Fetch related questions for each answer
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Merge answers with corresponding question details
    const answersWithQuestions = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      return {
        ...answer._doc, // Include all answer fields
        question: question ? question.question : null, // Include question text if found
        questionOrder: question ? question.questionOrder : null, // Include question order if found
      };
    });

    res.status(200).json({
      status: 'success',
      data: answersWithQuestions,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

const getAnsweredQuestions = async (req, res) => {
  const { questionType, questionSubType,projectId } = req.params;
  console.log(questionType);
  console.log(questionSubType);
  console.log(projectId);
  try {
    // Find questions based on questionType and questionSubType
    const answers = await Answer.find({ questionType, questionSubType,projectId }).populate('questionId', 'questionType questionSubType question');
    console.log(answers);
    if (!answers.length) {
      return res.status(200).json({ message: 'No questions found for the given type and subtype' });
    }

   
    console.log(answers);

    res.status(200).json({
      status: 'success',
      data: answers,
    });
  } catch (error) {
    console.error('Error fetching answered questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// const getAnsweredQuestions = async (req, res) => {
//   const { questionType, questionSubType,projectId } = req.params;
//   console.log(questionType);
//   console.log(questionSubType);
//   console.log(projectId);
//   try {
//     // Find questions based on questionType and questionSubType
//     const questions = await Question.find({ questionType, questionSubType });
//     console.log(questions);
//     if (!questions.length) {
//       return res.status(404).json({ message: 'No questions found for the given type and subtype' });
//     }

//     // Extract question IDs
//     const questionIds = questions.map(question => question._id);

//     // Find answers for the extracted question IDs
//     const answers = await Answer.find({
//       questionId: { $in: questionIds },
//       projectId
//     })
//       .populate('questionId', 'questionType questionSubType question')
//       .populate('userId', 'name')// Adjust the fields to populate as necessary
//       .populate('projectId', 'name'); // Adjust the fields to populate as necessary
//     console.log(answers);

//     res.status(200).json({
//       status: 'success',
//       data: answers,
//     });
//   } catch (error) {
//     console.error('Error fetching answered questions:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const getAnswerById = async (req, res) => {
  try {
    const id = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const answer = await Answer.findById(id).populate('questionId', 'questionType questionSubType question');

    // Check if the user exists
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Return the user data in the response
    res.status(200).json({
      status: 'success',
      data: answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller to update an existing answer
const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = req.body.data.answer;
    // Check if answer is empty
    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(id, { answer }, { new: true });

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.status(200).json({ status: 200, message: 'Answer updated successfully', data: updatedAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all answers by user
const getAllAnswersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const answers = await Answer.find({ userId });

    res.status(200).json({ status: 200, data: answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAnswer = async (req, res) => {
    try {
      const { answerId } = req.params;
  
      const deletedAnswer = await Answer.findByIdAndDelete(answerId);
  
      if (!deletedAnswer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
  
      res.status(200).json({ status: 200, message: 'Answer deleted successfully', data: deletedAnswer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getUnansweredQuestionSubTypes = async (req, res) => {
  const { questionType, projectId } = req.params;
console.log(req);
console.log("in previous");
  try {
    // Find all questions of the specified questionType and projectId
    const questions = await Question.find({ questionType, projectId });

    // Extract unique questionSubTypes from the questions
    const questionSubTypes = [...new Set(questions.map(q => q.questionSubType))];

    // Initialize an array to hold subTypes with no unanswered questions
    const subTypesWithNoUnansweredQuestions = [];

    // Check each subType for unanswered questions
    for (const subType of questionSubTypes) {
      // Find unanswered questions for the subType within the projectId
      const unansweredQuestions = await Question.find({ 
        questionType, 
        questionSubType: subType,
        projectId 
      }).lean().exec();

      const unansweredQuestionIds = unansweredQuestions.map(q => q._id);

      // Find answered questions for the projectId and questionType/subType
      const answeredQuestions = await Answer.find({
        questionId: { $in: unansweredQuestionIds },
        projectId
      }).lean().exec();

      // Check if the number of answered questions is equal to the number of unanswered questions
      if (unansweredQuestionIds.length === answeredQuestions.length) {
        subTypesWithNoUnansweredQuestions.push(subType);
      }
    }

    res.status(200).json({
      message: 'SubTypes with no unanswered questions retrieved successfully',
      subTypes: subTypesWithNoUnansweredQuestions
    });
  } catch (error) {
    console.log(error);
    console.error('Error retrieving subTypes:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the subTypes' });
  }
};


module.exports = { 
    createAnswer, 
    updateAnswer, 
    getAllAnswersByUser,
    getAnswersByCriteria,
    deleteAnswer,
    getAnsweredQuestions,
    getAnswerById,
    getUnansweredQuestionSubTypes
 };
