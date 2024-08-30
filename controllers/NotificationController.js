// controllers/notificationController.js
const Notification = require('../models/NotificationModel');

// Get all notifications for a specific project
const getNotificationsByProjectId = async (req, res) => {
    try {
        const notifications = await Notification.find({ projectId: req.params.projectId });
        if (!notifications) {
          // If summary is not found, return a 404 error
          return res.status(200).json({ status: 400, data: "no notification" });
        }

        res.status(200).json({ status: 200, data: notifications });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
       
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        const updatedNotification = await notification.save();
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new notification
const createNotification = async (req, res) => {
    const { projectId, message } = req.body;

    // Manual validation
    if (!projectId || !message) {
        return res.status(400).json({ message: 'Project ID and message are required' });
    }

    try {
        const newNotification = new Notification({ projectId, message });
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotificationsByProjectId,
    markNotificationAsRead,
    createNotification,
    deleteNotification,
};
