// controllers/userWaitlistController.js
const UserWaitlist = require('../models/UserWaitlistModel');
const Joi = require('joi');
const { sendEmail } = require('./MailController'); 

const addToWaitlist = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;

    const newWaitlistEntry = new UserWaitlist({ email });
    await newWaitlistEntry.save();

    const text = `
    Hi innovator,
    
    Welcome to Craddule. We are all set to help you turn your dreams and ideas into reality. We are very much excited that you have taken this step and will be with you to support and Craddule you through it all.
    
    Warm greetings,
    From your new friends at Craddule.
    `;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Hi innovator,</div>
            <p>Welcome to Craddule. We are all set to help you turn your dreams and ideas into reality. We are very much excited that you have taken this step and will be with you to support and Craddule you through it all.</p>
            <p>Warm greetings,</p>
            <p>From your new friends at Craddule.</p>
        </div>
    </body>
    </html>
    `;
    
    const emailData = {
      to: email,
      subject: 'Waitlist submission',
      text: text,
      html: html
    };
    
    // Call the sendEmail function
    await sendEmail(
      { body: emailData }, // Passing the email data as if it came from a request
      console.log(res) // Passing the response object to handle the response in the same way
    );

    res.status(201).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addToWaitlist
};
