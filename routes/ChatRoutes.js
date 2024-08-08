// routes/UserRoutes.js
const express = require('express');
const { getChats } = require('../controllers/ChatController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

console.log('chat');
router.get('/:projectId',getChats);
module.exports = router;
