// models/Notification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project', // Reference to the Project model
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    notificationRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
