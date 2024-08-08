// routes/UserRoutes.js
const express = require('express');
const { createAnswer, getAllAnswersByUser,updateAnswer, deleteAnswer,getAnswersByCriteria,getAnsweredQuestions,getAnswerById,getUnansweredQuestionSubTypes } = require('../controllers/AnswerController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

console.log('answered');
router.post('/', AuthRoutes.verifyTokenUser,createAnswer);
router.get('/:id', AuthRoutes.verifyTokenUser,getAllAnswersByUser);
router.get('/single/:id', AuthRoutes.verifyTokenUser,getAnswerById);
router.get('/answered/:questionType/:questionSubType/:projectId', AuthRoutes.verifyTokenUser,getAnsweredQuestions);
router.get('/answered/cat/:questionType/:projectId',AuthRoutes.verifyTokenUser,getUnansweredQuestionSubTypes);
router.put('/:id', AuthRoutes.verifyTokenUser,updateAnswer);
router.delete('/:id', AuthRoutes.verifyTokenUser,deleteAnswer);
router.get('/:projectId/:questionType/:questionSubType', AuthRoutes.verifyTokenUser,getAnswersByCriteria);
module.exports = router;
