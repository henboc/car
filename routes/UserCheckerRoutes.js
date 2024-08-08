// routes/UserRoutes.js

const express = require('express');
const { createCheck } = require('../controllers/UserCheckerController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createCheck);

module.exports = router;
