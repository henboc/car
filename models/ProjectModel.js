// models/User.js

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectName: String,
  projectType: String,
  projectCount: Number, //for feedback check
  phases: [
    {
      type: String,
    }
  ],
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;