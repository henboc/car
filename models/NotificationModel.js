const { boolean } = require('joi');
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    projectId: String,
    userId: String,
    notification: String,
    notificationHead: String,
    notificationRead:{
      type: Boolean,
      default: false,
  },
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;
