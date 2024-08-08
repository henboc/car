// controllers/notificationController.js
const { sendNotification } = require('../services/firebaseService');

const sendNotificationHandler = async (req, res) => {
  const { title, body, token } = req.body;

  try {
    await sendNotification(title, body, token);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    res.status(500).send('Error sending notification: ' + error);
  }
};

module.exports = {
  sendNotificationHandler,
};
