const express = require('express');
const { createFinish,getNextQuestion,getFinshedByProjectId } = require('../controllers/FinishedController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createFinish);
router.get('/:projectId/:questionType/:questionSubType', AuthRoutes.verifyTokenUser,getNextQuestion);
router.get('/cat/:projectId/:questionType', AuthRoutes.verifyTokenUser,getFinshedByProjectId);

module.exports = router;
