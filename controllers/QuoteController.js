const mongoose = require('mongoose');
const Quote = require('../models/QuoteModel'); // Adjust the path as needed
const WatchedQuote= require('../models/WatchedQuoteModel');

// Create a new quote
const createQuote = async (req, res) => {
    console.log("quote");
  try {
    const { quoteType, quote} = req.body;

    // Check that each value exists
    if (!quoteType || !quote) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newQuote = new Quote({
      quoteType,
      quote,
    });

    await newQuote.save();
    res.status(200).json({ message: 'Quote created successfully', quote: newQuote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quotes
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single quote by ID
const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a quote by ID
const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { quoteType, quoteSubType, quoteLink, quoteOrder, quoteTime } = req.body;

    // Check that each value exists
    if (!quoteType || !quoteSubType || !quoteLink || !quoteOrder || !quoteTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { quoteType, quoteSubType, quoteLink, quoteOrder, quoteTime },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json({ message: 'Quote updated successfully', quote: updatedQuote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a quote by ID
const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuote = await Quote.findByIdAndDelete(id);

    if (!deletedQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getRandomQuote = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    // Get the count of all Quotes of the same QuoteSubType
    const totalQuotesCount = await Quote.countDocuments();

    console.log("totalQuotesCount");
    console.log(totalQuotesCount);

    if (totalQuotesCount === 0) {
      return res.status(404).json({ error: 'No Quotes available to watch ' });
    }

    // Get the IDs of Quotes the user has already watched in this subType and project
    const watchedQuotes = await WatchedQuote.find({ userId, projectId }).select('QuoteId');
    const watchedQuoteIds = watchedQuotes.map(v => v.quoteId);

    // Get the count of unwatched Quotes
    const unwatchedQuotesCount = totalQuotesCount - watchedQuoteIds.length;

    if (unwatchedQuotesCount === 0) {
      return res.status(404).json({ error: 'No unwatched Quotes available' });
    }

    // Get a random unwatched Quote
    const random = Math.floor(Math.random() * unwatchedQuotesCount);
    const unwatchedQuote = await Quote.findOne({ 
      _id: { $nin: watchedQuoteIds } 
    }).skip(random);

    console.log(unwatchedQuote);
    if (unwatchedQuote) {
      res.status(200).json({ status:200, Quote: unwatchedQuote });
      
    } else {
      res.status(404).json({ error: 'Quote not found' });
    }
  } catch (error) {
    console.error('Error getting random Quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const setActiveQuote = async (req, res) => {
  try {
    const { userId, projectId, quoteId } = req.body;

    // Find the Quote by ID to ensure it exists
    const Quote = await Quote.findById(quoteId);
    console.log(req.body);
   

    // Create or update the watched Quote record to set it as active

    const newQuote = new WatchedQuote({
      userId,
      projectId,
      quoteId,
      quoteStatus:'done'
    });

    await newQuote.save();
    res.json({ message: 'Active Quote set successfully', Quote:newQuote });
  } catch (error) {
    console.error('Error setting active Quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const checkActiveQuote = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    console.log("checking Active");
    console.log("checking Active cache");
    console.log(req.body)

    // Find the active Quote with the given parameters
    const activeQuote = await WatchedQuote.findOne({
      userId,
      projectId,
      quoteStatus: 'done'
    }).populate('QuoteId');

    console.log(activeQuote);

    if (activeQuote) {
      res.json({ status: 200, active: true, Quote: activeQuote });
    } else {
      res.json({ status: 200, active: false });
    }
  } catch (error) {
    console.error('Error checking active Quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id,userId,projectId } = req.params;
   

    console.log(id);

    

    // Authenticate the user using their current credentials
    const watchedQuote = new WatchedQuote({
      userId,
      projectId,
      quoteId: id,
      quoteStatus:'done'
    });

    await watchedQuote.save();

    res.json({ status: 200, message: 'Status Changed Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  getRandomQuote,
  setActiveQuote,
  updateStatus,
  checkActiveQuote
};

