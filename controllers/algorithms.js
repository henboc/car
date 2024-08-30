const Question = require('../models/QuestionModel');
const Answer = require('../models/AnswerModel');
const Project = require('../models/ProjectModel');
const Timeline = require('../models/TimelineModel'); // Adjust the path as necessary
const Hub = require('../models/HubModel'); // Adjust the path as necessary
const Joi = require('joi');



const countTotalQuestionsAnsweredByTypeAndProject = async (req, res) => {
   
    console.log("here algo cont");
    try {

        console.log(req.params);
        const { userId, questionType, projectId } = req.params;
      // Find all answers that match the provided userId, projectId, and include the questionId
      
      const answers = await Answer.find({ userId: userId, projectId: projectId }).select('questionId');

      console.log("answrs");
      console.log(answers);
  
      // Extract distinct questionIds from the answers
      const distinctQuestionIds = [...new Set(answers.map(answer => answer.questionId))];
  
      // Count the distinct questionIds with matching questionType
      let totalCount = 0;
  
      // Iterate through distinct questionIds to get the questionType from the Question model
      for (const questionId of distinctQuestionIds) {
        const question = await Question.findById(questionId);
        if (question && question.questionType === questionType) {
          totalCount++;
        }
      }
  
      console.log(`Total number of questions answered by user '${userId}' with questionType '${questionType}' in project '${projectId}': ${totalCount}`);
      res.json({ status: 200, message: 'Project deleted successfully', data: totalCount });
    
    } catch (error) {
      console.error('Error counting total questions:', error);
      return 0; // Return 0 in case of error
    }
  };
  

  const getTotalQuestionsByType =  async (req, res) => {
    try {
        const { questionType } = req.params;
        // Count the total number of questions with the specified questionType
        const totalCount = await Question.countDocuments({ questionType });
        res.json({ status: 200, message: 'Project deleted successfully', data: totalCount });
    } catch (error) {
        console.error('Error counting total questions:', error);
        return 0; // Return 0 in case of an error
    }
};


const calculateCompletion = async (req, res) => {
  try {
    const { timelineId, phase, projectId } = req.params;
    // Fetch the timeline
    const timeline = await Timeline.findById(timelineId);

    if (!timeline) {
      throw new Error('Timeline not found');
    }

    let questionPercentage = 0;
    let uploadPercentage = 0;

    // Calculate question percentage if setQuestion is true
    if (timeline.setQuestion) {
      // Get all questions for the given phase
      const questions = await Question.find({ phase });

      // Get all answers for the questions in the given phase
      const answers = await Answer.find({
        questionId: { $in: questions.map(q => q._id) },
        projectId: timeline.projectId
      });

      // Calculate percentage of questions answered
      const totalQuestions = questions.length;
      const answeredQuestions = answers.length;

      if (totalQuestions > 0) {
        questionPercentage = (answeredQuestions / totalQuestions) * 100;
      }
    }

    // Calculate upload percentage if setUpload is true
    if (timeline.setUpload) {
      // Get all uploads for the given timeline ID
      const uploads = await Hub.find({ timelineId });

      if (uploads.length > 0) {
        uploadPercentage = 100;
      }
    }

    // Calculate combined percentage if both setQuestion and setUpload are true
    let totalPercentage = 0;
    if (timeline.setQuestion && timeline.setUpload) {
      totalPercentage = (questionPercentage * 0.5) + (uploadPercentage * 0.5);
    } else if (timeline.setQuestion) {
      totalPercentage = questionPercentage;
    } else if (timeline.setUpload) {
      totalPercentage = uploadPercentage;
    }

    return totalPercentage;
  } catch (error) {
    console.error('Error calculating completion percentage:', error);
    throw error;
  }
};

const calculateCompletion2 = async (timeline) => {
  let questionPercentage = 0;
  let uploadPercentage = 0;

  // Calculate question percentage if setQuestion is true
  if (timeline.setQuestion) {
    // Get all questions for the given phase (matching questionType in Question)
    const questions = await Question.find({ questionType: timeline.phase });
    
    // Get all answers for the questions in the given phase
    const answers = await Answer.find({
      questionId: { $in: questions.map(q => q._id) },
      projectId: timeline.projectId
    }).sort({ projectId: 1 });

    // Calculate percentage of questions answered
    const totalQuestions = questions.length;
    const answeredQuestions = answers.length;

    if (totalQuestions > 0) {
      questionPercentage = (answeredQuestions / totalQuestions) * 100;
    }
  }

  // Calculate upload percentage if setUpload is true
  if (timeline.setUpload) {
    // Get all uploads for the given timeline ID
    const uploads = await Hub.find({ timelineId: timeline._id }).sort({ projectId: 1 });

    if (uploads.length > 0) {
      uploadPercentage = 100;
    }
  }

  // Calculate combined percentage if both setQuestion and setUpload are true
  let totalPercentage = 0;
  if (timeline.setQuestion && timeline.setUpload) {
    totalPercentage = (questionPercentage * 0.5) + (uploadPercentage * 0.5);
  } else if (timeline.setQuestion) {
    totalPercentage = questionPercentage;
  } else if (timeline.setUpload) {
    totalPercentage = uploadPercentage;
  }

  totalPercentage = parseFloat(totalPercentage.toFixed(1));

  return totalPercentage;
};


const getTimelines = async(req, res)=>{
  try {
    const { projectId } = req.params;
    const timelines = await Timeline.find({ projectId });

    const timelinesWithPercentages = await Promise.all(
      timelines.map(async (timeline) => {
        const percentage = await calculateCompletion2(timeline);
        return {
          ...timeline.toObject(),
          completionPercentage: percentage
        };
      })
    );

    res.json(timelinesWithPercentages);
  } catch (error) {
    console.error('Error fetching timelines:', error);
    res.status(500).send('Server error');
  }
}

const calculateAnsweredPercentage = async (req, res) => {
  const { projectId, questionType } = req.params;

  try {
      // Step 1: Fetch the total number of questions by projectId and questionSubType
      const totalQuestions = await Question.countDocuments({ 
        questionType 
      });

      // Step 2: Fetch the number of answered questions by projectId and questionSubType
      const answeredQuestions = await Answer.countDocuments({ 
          projectId, 
          questionType 
      });

      // Step 3: Calculate the percentage
      const percentage = totalQuestions > 0 
          ? (answeredQuestions / totalQuestions) * 100 
          : 0;

      // Step 4: Return the result
      return res.status(200).json({
          projectId,
          questionType,
          totalQuestions,
          answeredQuestions,
          percentage: percentage.toFixed(2) // Limit to two decimal places
      });
  } catch (error) {
      console.error('Error calculating answered percentage:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { 
    countTotalQuestionsAnsweredByTypeAndProject, 
    getTotalQuestionsByType,
    calculateCompletion,
    calculateCompletion2,
    getTimelines,
    calculateAnsweredPercentage
};
