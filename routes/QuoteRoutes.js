// routes/UserRoutes.js

const express = require('express');
const {createQuote, getQuotes, getQuoteById,updateQuote, deleteQuote,getRandomQuote,setActiveQuote,checkActiveQuote,updateStatus } = require('../controllers/QuoteController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();
console.log("quote");
router.post('/', createQuote);
router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.put('/:id',updateQuote);
router.delete('/:id',deleteQuote);
router.get('/count/:userId/:projectId',getRandomQuote);
router.post('/active',setActiveQuote);
router.post('/active/check',checkActiveQuote);
router.put('/status/:id/:userId/:projectId',updateStatus);

module.exports = router;
