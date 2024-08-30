// models/Nda.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NdaSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project', // Assuming you have a Project model
        required: true,
    },
    nda: {
        type: String,
        required: true,
    },
    lastTimeModified: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Nda', NdaSchema);
