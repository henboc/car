const mongoose = require('mongoose');

const watchedVideoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  videoSubType: String,
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'video' },
  videoStatus:  String,
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

const WatchedVideo = mongoose.model('WatchedVideo', watchedVideoSchema);

module.exports = WatchedVideo;
