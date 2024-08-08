const express = require('express');
const { createAnswered, getAnswered } = require('../controllers/AnsweredController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createAnswered);
router.get('/:id/:type', AuthRoutes.verifyTokenUser,getAnswered);

module.exports = router;
