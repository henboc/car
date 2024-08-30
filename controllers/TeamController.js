// controllers/UserController.js
require('dotenv').config();
const Team = require('../models/TeamModel');
const TeamInvite = require('../models/TeamInviteModal');
const User = require('../models/UserModel');
const Project = require('../models/ProjectModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const API_BASE_URL = require('../config');
const { sendEmail } = require('./MailController'); 
const Notification = require('../models/NotificationModel');



const createTeam = async (req, res) => {
  try {
    // Validate input using Joi
    // const schema = Joi.object({
    //   projectId: Joi.string().required(),
    //   link: Joi.string().required(),
    //   uniqueCode: Joi.string().required(),
    //   email: Joi.string().email().required(),
    // });

    // const { error } = schema.validate(req.body);


    // if (error) {
    //   console.log(req.body);
    //   return res.status(400).json({ error: error.details[0].message });
    // }
    const { projectId, link, email,uniqueCode,nda} = req.body;
    

    console.log(nda);
    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }
    

    const project = await Project.findById(projectId).populate('userId');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectOwner = project.userId.firstName; // Assuming User model has a 'name' field
    if (!projectOwner) {
      return res.status(404).json({ error: 'Project owner not found' });
    }

    const newTeam = new TeamInvite({
      projectId,
      email,
      link,
      uniqueCode,
    });
    //console.log(newTeam);
    await newTeam.save();
    newlink = API_BASE_URL+link;
   
    let extraNda = '';
    if(nda !== ""){
      extraNda = `
        <br>
        <br>
        <p>Below is an attached Nda, Clicking on the link means you accept this nda<p>
        <br>
        <br>
        ${nda}
      `;

    }

  // const notification = new Notification({
  //     projectId,
  //     notificationHead:'New Team Member',
  //     notification: 'A new NDA has been created for your project.',
  //     notificationRead:false
  // });
  // await notification.save();

    const text = `
    Hi co-creator,

    ${projectOwner} is inviting you to collaborate on an exciting project. Please see the Non-Disclosure Agreement sent to each team member from the invitee. Use this link ${newlink} to join the team. Clicking this link and joining the team is taken as an acceptance of the NDA.
    Feel free to discuss with the invitee before accepting this invitation.
    
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
            .link {
                color: #1a73e8;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Hi co-creator</div>
            <p>${projectOwner} is inviting you to collaborate on an exciting project. Please see the Non-Disclosure Agreement sent to each team member from the invitee. Use this link <a href="${newlink}" class="link">${newlink}</a> to join the team. Clicking this link and joining the team is taken as an acceptance of the NDA.</p>
            <p>Feel free to discuss with the invitee before accepting this invitation.</p>
            <p>Warm greetings,</p>
            <p>From your new friends at Craddule.</p>
            ${extraNda}
        </div>
    </body>
    </html>
    `;
    
    const emailData = {
      to: email,
      subject: 'New Team Invite',
      text: text,
      html: html
    };
    
    // Call the sendEmail function
    await sendEmail(
      { body: emailData }, // Passing the email data as if it came from a request
      console.log(res) // Passing the response object to handle the response in the same way
    );
    console.log("project owner:" +projectOwner);
    res.json({ status: 200, message: 'Success'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
    try {
        const { email, password,link,uniqueCode } = req.body;
    
        // Validate input using Joi
        const schema = Joi.object({
          link: Joi.string().required(),
          uniqueCode: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required()
        });
        
        console.log(req.body)
        const { error } = schema.validate(req.body);
    
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

       
        let userId = "";
        //const user = await User.findOne({ email });
        const user = await User.findOne({
          $or: [
            { email: email }, // Check if the email matches
            
          ],
        });
    
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }else{
             userId = user._id;
        }
    
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid Password' });
        }

       

     
     
      const existingUserLink = await TeamInvite.findOne({ uniqueCode:uniqueCode, email:email});

      if (existingUserLink) {
         
        console.log('Existing Link');
        
      } else {
        
        return res.status(400).json({ error: 'Link Does not Exist' });
      }

     
      const newTeam = new Team({
        userId:user._id,
        teamRole:"Team Member",
        projectId: existingUserLink.projectId,
        link: link,
        // Add other properties as needed
      });
      await newTeam.save();

      await TeamInvite.findOneAndDelete({ uniqueCode, email });

      
    
        // Validate new password and confirm password match
        const access_token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    
        res.json({ status: 200, message: 'Login successfully', token: access_token, user: user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const signup = async (req, res) => {
    try {
      // Validate input using Joi
      console.log("team con sign")
      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required(),
        cpassword: Joi.string().required(),
        link: Joi.string().required(),
        uniqueCode: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
      
      console.log(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { firstName, lastName, email, phoneNumber, password,link,uniqueCode} = req.body;
      
      // Check if phone number is exactly 11 characters
      if (phoneNumber.length < 11) {
        return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
      }
  
      if (phoneNumber.length > 13) {
        return res.status(400).json({
          error: 'Incorrect phone number length'
        });
      }
  
      console.log("here");
      console.log(password);
  
      // Check if email is in proper format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Incorrect email format' });
      }
      
  
      // Check if first name and last name are not more than 20 characters
      if (firstName.length > 20 || lastName.length > 20) {
        return res.status(400).json({ error: 'First name or last name too long' });
      }
  
  
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      const existingUserPhone = await User.findOne({ phoneNumber });
      if (existingUserPhone) {
        return res.status(400).json({ error: 'Phone Number already exists' });
      }
      
  
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      console.log(password)
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
      }

      const existingUserLink = await TeamInvite.findOne({ uniqueCode:uniqueCode, email:email });

      if (existingUserLink) {
         
        console.log('Existing Link');
        
      } else {
        
        return res.status(400).json({ error: 'Link Does not Exist' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword, // Save the hashed password
          // Add other properties as needed
        });
        console.log(newUser);
        await newUser.save();
       

        const newTeam = new Team({
          userId:newUser._id,
          teamRole:"Team Member",
          projectId: existingUserLink.projectId,
          link: link,
          // Add other properties as needed
        });
        await newTeam.save();

        await TeamInvite.findOneAndDelete({ uniqueCode, email });

        const notification = new Notification({
          projectId,
          notificationHead:'New Team Member',
          notification: firstName+' As been added to the Team',
          notificationRead:false 
      });
      await notification.save();
        const access_token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ status: 200, message: 'Success',data:{ user: newUser, access_token }});
        //return res.status(400).json({ error: 'Not Found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  const getTeamMembersByProjectId = async (req, res) => {
    try {
        const projectId = req.params.id;

        console.log(req.params.id);
        console.log(projectId);

        if (!projectId) {
            return res.status(400).json({ error: 'No Project' });
        }
      const teamMembers = await Team.find({ projectId }).populate('userId', 'firstName lastName');
  
      // if (teamMembers.length === 0) {
      //   return {
      //     status: 'error',
      //     message: 'No team members found for the given project ID',
      //   };
      // }


  
      // const teamMembersWithUserDetails = await Promise.all(teamMembers.map(async (member) => {
      //   const user = await User.findOne({ _id: member.userId });
      //   const userDetails = user ? { firstName: user.firstName, lastName: user.lastName } : { firstName: '', lastName: '' };
      //   return { ...member.toObject(), userDetails };
      // }));

      res.status(200).json({
        status: 'success',
        data: teamMembers,
      });
  
     
    } catch (error) {
      console.error('Error fetching team members:', error);
      return {
        status: 'error',
        message: 'Internal Server Error',
      };
    }
  };

  

  const getTeamProjectsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        console.log(req.params.id);
        console.log(userId);

        if (!userId) {
            return res.status(400).json({ error: 'No User' });
        }
        const teamMembers = await Team.find({
          userId: userId,
          teamRole: { $ne: 'owner' }
        });
  
      if (teamMembers.length === 0) {
        return {
          status: 'error',
          message: 'No Projects Found',
        };
      }
  
      const teamMembersWithUserDetails = await Promise.all(teamMembers.map(async (member) => {
        const project = await Project.findOne({ _id: member.projectId });
        const projectDetails = project ? { project: project.projectName} : { projectName: '' };
        return { ...member.toObject(), projectDetails };
      }));

      res.status(200).json({
        status: 'success',
        data: teamMembersWithUserDetails,
      });
  
     
    } catch (error) {
      console.error('Error fetching team members:', error);
      return {
        status: 'error',
        message: 'Internal Server Error',
      };
    }
  };
  
  
const getTeamById = async (req, res) => {
  try {
    const projectId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const tean = await Team.findById(projectId);

    // Check if the user exists
    if (!tean) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input using Joi
    const schema = Joi.object({
      userId: Joi.string().required(),
      link: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userId, lastName, email, phoneNumber} = req.body;

    if (phoneNumber.length < 11) {
      return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
    }

    if (phoneNumber.length > 13) {
      return res.status(400).json({ error: 'Incorrect phone number length' });
    }

    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }

    // Check if first name and last name are not more than 20 characters
    if (firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({ error: 'First name or last name too long' });
    }
    
    
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    //res.json(updatedUser);
    res.json({ status: 200, message: 'Profile changed successfully',user:updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input using Joi
    // const schema = Joi.object({
    //   currentPassword: Joi.string().required(),
    //   newPassword: Joi.string().required(),
    //   confirmNewPassword: Joi.string().required(),
    // });

    // const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }



    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ status: 200, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id } = req.params;
    const { status } = req.body;

    console.log(status);

    

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ status: 200, message: 'Status Changed Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const changePasswordCustomer = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      newPassword: Joi.string().required(),
      confirmNewPassword: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ status: 200, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Team.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    console.log("controller");
    console.log(req);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const image = req.files.image;

    const imagePath = `${Date.now()}-${image.name}`;
    console.log('Destination path:', imagePath);
    image.mv(imagePath);

    // Do something with the image data, such as saving it to a directory or database
    // Example: image.mv('/path/to/save/image.jpg');

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTeam,
  getTeamById,
  login,
  signup,
  getTeamMembersByProjectId,
  getTeamProjectsByUserId,
  deleteTeamMember,
};
