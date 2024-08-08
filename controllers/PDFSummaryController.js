const PDF = require('../models/PDFModel');
const Summary = require('../models/summaryModel');
const Notification = require('../models/NotificationModel');
// Controller to create or update summary
const createOrUpdateSummary = async (req, res) => {
    console.log("here sum");
    console.log(req.user.userId);
    console.log("first create")
  try {
    const { projectId, category, summary, phase,userId} = req.body;
    console.log(req.body);
    // Check if a summary already exists for the given projectId and questionType
    let existingSummary = await PDF.findOne({ projectId, questionType:category });
    
    if (existingSummary) {
      // Update existing summary
      existingSummary.summary = summary;
      await existingSummary.save();
      console.log(existingSummary);
      // const notification = new Notification({
      //   projectId,
      //   userId,
      //   notification: questionSubType+ ' Summary Updated',
      //   notificationHead: 'Summary Update'
      // });
     // await notification.save();

      res.status(200).json({ message: 'Summary updated successfully' });
    } else {
      // Create new summary
     
     

      const newSummary = new PDF({
        projectId,
        questionType:category,
        summary,
        userId,
        phase
      });

      await newSummary.save();
      console.log(newSummary);
      // const notification = new Notification({
      //   projectId,
      //   userId,
      //   notification: questionSubType+ ' Summary Added',
      //   notificationHead: 'Summary Update'
      // });
      //await notification.save();

      res.status(201).json({ message: 'Summary created successfully' });
    }
  } catch (error) {
    console.error('Error creating or updating summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSummaryByProjectIdTypeAndSubType = async (req, res) => {
    try {
      const { projectId, questionType } = req.params;

      console.log("first get")
      
      console.log(projectId);
      console.log(questionType);
      // Find the summary based on the provided projectId, questionType, and questionSubType
      const summary = await PDF.findOne({ projectId, questionType });
      console.log(summary);
     
      
      if (!summary) {
        // If summary is not found, return a 404 error
        return res.status(200).json({ status: 200, data: summary });
      }
  
      // If summary is found, return it in the response
      res.status(200).json({ status: 200, data: summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getPdfSummaryByProjectIdTypeAndSubType = async (req, res) => {
    try {
      const { projectId,phase } = req.params;

      console.log("first get")
      
      console.log(projectId);
      console.log(phase);
      // Find the summary based on the provided projectId, questionType, and questionSubType
      const summary = await PDF.find({ projectId, phase });
      console.log(summary);
     
      
      if (!summary) {
        // If summary is not found, return a 404 error
        return res.status(200).json({ status: 200, data: summary });
      }
  
      // If summary is found, return it in the response
      res.status(200).json({ status: 200, data: summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getSummaryByProjectIdType = async (req, res) => {
    try {

      console.log("second get")
      const { projectId, questionType } = req.params;

      console.log(req.params);
  
      // Find the summary based on the provided projectId, questionType, and questionSubType
      const summary = await Summary.find({ projectId, questionType });
      console.log(summary);
      if (!summary) {
        console.log("mo summary");
        // If summary is not found, return a 404 error
        return res.status(200).json({ status: 200, data: summary });
      }

      console.log("summary");
      // If summary is found, return it in the response
      res.status(200).json({ status: 200, data: summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
module.exports = { createOrUpdateSummary, getSummaryByProjectIdTypeAndSubType,getSummaryByProjectIdType,getPdfSummaryByProjectIdTypeAndSubType };
