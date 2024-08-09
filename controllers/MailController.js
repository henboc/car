// controllers/emailController.js

const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'mail.craddule.com', // Your SMTP server
    port: 587, // Usually 587 for TLS or 465 for SSL
    secure: false, // Set to true if you use port 465, false for 587
    auth: {
        user: 'verification@craddule.com', // Your email address
        pass: '=DcXXC@Jjn-w' // Your email password
    }
});

// Controller to send an email
const sendEmail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Craddule" <verification@craddule.com>', // Sender address
            to: to, // List of receivers
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html // HTML body (optional)
        });

        console.log('Message sent: %s', info.messageId);
        return
        // res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

module.exports = {
    sendEmail
  };