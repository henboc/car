// routes/UserRoutes.js

const express = require('express');
const { createOrUpdateSummary,getSummaryByProjectIdTypeAndSubType,getSummaryByProjectIdType,getPdfSummaryByProjectIdTypeAndSubType } = require('../controllers/PDFSummaryController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();
console.log("here sum");

router.post('/', AuthRoutes.verifyTokenUser,createOrUpdateSummary);
router.get('/:projectId/:questionType', AuthRoutes.verifyTokenUser,getSummaryByProjectIdTypeAndSubType);
router.get('/end/:projectId/:phase', AuthRoutes.verifyTokenUser,getPdfSummaryByProjectIdTypeAndSubType);
router.get('/single/:projectId/:questionType', AuthRoutes.verifyTokenUser,getSummaryByProjectIdType);

module.exports = router;
