// routes/UserRoutes.js

const express = require('express');
const { createQuestion,getQuestionById,getUniqueQuestionSubTypes,getSubCategoriesByCategory } = require('../controllers/QuestionController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createQuestion);
router.get('/:id', AuthRoutes.verifyTokenUser, getQuestionById);
router.get('/sub/:questionType', AuthRoutes.verifyTokenUser, getUniqueQuestionSubTypes);
router.get('/cat/:category', AuthRoutes.verifyTokenUser, getSubCategoriesByCategory);

module.exports = router;
