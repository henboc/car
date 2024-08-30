const TellUs = require('../models/TellUsModel'); // Adjust the path as needed

// Create a new TellUs entry
const createTellUs = async (req, res) => {
    const { userId, projectId, feedback } = req.body;
    console.log(req.body)

    if (!userId || !projectId || !feedback) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
   
    console.log(req.body)

    try {
        const newTellUs = new TellUs({
            userId,
            projectId,
            tellUs:feedback,
        });

        const savedTellUs = await newTellUs.save();
        return res.json({ status: 200, message: 'Success', data:savedTellUs});
    } catch (error) {
        console.error('Error creating TellUs entry:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createTellUs
};
