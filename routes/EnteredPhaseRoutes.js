// routes/UserRoutes.js
const express = require('express');
const { checkAndInsertEnteredPhase } = require('../controllers/EnteredPhaseController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

console.log('entared route');
router.post('/', AuthRoutes.verifyTokenUser,checkAndInsertEnteredPhase);
module.exports = router;
