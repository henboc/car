// controllers/accelerateController.js
const Accelerate = require('../models/AccelerateModel');
const Joi = require('joi');

const createAccelerate = async (req, res) => {
    try {
        const schema = Joi.object({
            projectId: Joi.string().required(),
            phases: Joi.array().items(Joi.string()).required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { projectId, phases } = req.body;

        const newAccelerate = new Accelerate({
            projectId,
            phases
        });

        await newAccelerate.save();

        res.status(201).json({ message: 'Accelerate document created successfully', data: newAccelerate });
    } catch (error) {
        console.error('Error creating Accelerate document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllAccelerates = async (req, res) => {
    try {
        const accelerates = await Accelerate.find().populate('projectId', 'projectName projectType');
        res.status(200).json({ data: accelerates });
    } catch (error) {
        console.error('Error fetching Accelerate documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createAccelerate,
    getAllAccelerates
};
