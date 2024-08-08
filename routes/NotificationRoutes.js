// routes/notificationRoutes.js
const express = require('express');
const { sendNotificationHandler } = require('../controllers/notificationController');

const router = express.Router();

router.post('/send-notification', sendNotificationHandler);

module.exports = router;
