const express = require('express');
const router = express.Router();
const { createTellUs } = require('../controllers/TellUsController');

// Route to create a new TellUs entry
router.post('/', createTellUs);

module.exports = router;
