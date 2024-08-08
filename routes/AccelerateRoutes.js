// routes/accelerateRoutes.js
const express = require('express');
const { createAccelerate, getAllAccelerates } = require('../controllers/AccelerateController');

const router = express.Router();

router.post('/', createAccelerate);
router.get('/', getAllAccelerates);

module.exports = router;
