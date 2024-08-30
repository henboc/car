// controllers/ndaController.js
const Nda = require('../models/NdaModel');

// Get all NDAs
const getAllNdas = async (req, res) => {
    try {
        const ndas = await Nda.find().populate('projectId');
        res.status(200).json(ndas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get NDA by ID
const getNdaById = async (req, res) => {
    try {
        const nda = await Nda.findById(req.params.id).populate('projectId');
        if (!nda) return res.status(404).json({ message: 'NDA not found' });
        res.status(200).json(nda);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getNdaByProjectId = async (req, res) => {
    try {
        const nda = await Nda.findOne({ projectId: req.params.projectId }).populate('projectId');
        if (!nda) return res.status(404).json({ message: 'NDA not found for the given project ID' });
        res.status(200).json(nda);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new NDA
const createNda = async (req, res) => {
    const { projectId, nda } = req.body;

    // Manual validation to check if required fields are provided
    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }
    if (!nda) {
        return res.status(400).json({ message: 'NDA field is required' });
    }

    try {
        const newNda = new Nda({ projectId, nda });
        const savedNda = await newNda.save();
        res.status(200).json(savedNda);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an NDA
const updateNda = async (req, res) => {
    const { nda } = req.body;

    try {
        const ndaDoc = await Nda.findOne({ projectId: req.params.projectId });
        if (!ndaDoc) {
            return res.status(404).json({ message: 'NDA not found' });
        }

        if (!nda) {
            return res.status(400).json({ message: 'NDA field is required' });
        }

        // Update the NDA fields if they exist in the request body
        // ndaDoc.projectId = projectId || ndaDoc.projectId;
        ndaDoc.nda = nda || ndaDoc.nda;
        ndaDoc.lastTimeModified = Date.now();
        const updatedNda = await ndaDoc.save();
        res.status(200).json({data: updatedNda});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete an NDA
const deleteNda = async (req, res) => {
    try {
        const nda = await Nda.findByIdAndDelete(req.params.id);
        if (!nda) return res.status(404).json({ message: 'NDA not found' });
        res.status(200).json({ message: 'NDA deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllNdas,
    getNdaById,
    createNda,
    updateNda,
    deleteNda,
    getNdaByProjectId
};
