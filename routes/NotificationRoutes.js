// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
    getNotificationsByProjectId,
    markNotificationAsRead,
    createNotification,
    deleteNotification,
} = require('../controllers/NotificationController');

// Get all notifications for a specific project
router.get('/project/:projectId', getNotificationsByProjectId);

// Mark a notification as read
router.put('/:id/read', markNotificationAsRead);

// Create a new notification
router.post('/', createNotification);

// Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
