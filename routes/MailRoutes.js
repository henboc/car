const express = require('express');
const router = express.Router();
const {sendEmail} = require('../controllers/MailController');

// Define route for saving graph data
router.post('/', sendEmail);

module.exports = router;
