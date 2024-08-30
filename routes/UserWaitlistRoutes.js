// routes/userWaitlistRoutes.js
const express = require('express');
const { addToWaitlist } = require('../controllers/UserWaitlistController');

const router = express.Router();

router.post('/', addToWaitlist);

module.exports = router;
