const Joi = require('joi');
const Project = require('../models/ProjectModel'); // Import the Project model
const GoGate = require('../models/GoModel'); // Import the Project model
const ProjectGoGate = require('../models/ProjectGoGateModel'); // Import the Project model
const Team = require('../models/TeamModel'); // Team
const User = require('../models/UserModel'); // User

// Controller to create a new project
const createProject = async (req, res) => {
  try {
    const schema = Joi.object({
        userId: Joi.string().required(),
        projectName: Joi.string().required(),
      });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

    const { userId, projectName } = req.body;
    const currentTime = new Date();

    if (!projectName) {
        return res.status(400).json({ error: 'Project name is required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'Please Login' });
      }
      const projectCount = Math.random() < 0.5 ? 1 : 2;

    const newProject = new Project({
      userId,
      projectName,
      projectCount,
      timeOfCreation: currentTime,
    });

    await newProject.save();

    const goGates = await GoGate.find();

        // Iterate over each GoGate document
        for (const goGate of goGates) {
            // Create a new ProjectGoGate document with the same data and "not started" status
            const projectGoGate = new ProjectGoGate({
                goGate: goGate.goGate,
                goGateName: goGate.goGateName,
                phase: goGate.phase,
                order: goGate.order,
                projectId: newProject._id, // Set the projectId to the ID of the newly created project
                goStatus: 'not started'
            });

            // Save the ProjectGoGate document to the database
            await projectGoGate.save();
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(400).json({ error: 'User not found' });
        }
    
        const { email } = user;
    
        // Create a new Team document
        const newTeam = new Team({
          projectId: newProject._id,
          userId,
          email,
          teamRole:'owner',
        });
        await newTeam.save();


    res.status(200).json({ status: 200, message: 'Project created successfully', data: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ status: 200, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProjectDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log("Project details");
    const project = await Project.findById(id);
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log(project);
    res.status(200).json({ status: 200, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get projects by user ID
const getUserProjects = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    console.log(id);
    const userProjects = await Project.find({ userId:id });
    console.log('projects');
    console.log(userProjects);
    res.json({ status: 200, data: userProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProjectNameById = async (req, res) => {
  try {
    console.log("here controll");
    const { id } = req.params;
    console.log(req.params);

    // Fetch the project by ID and return just the name
    const project = await Project.findById(id).select('projectName');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ name: project.projectName });
  } catch (error) {
    console.error('Error fetching project nameer4:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateProjectType = async (req, res) => {
  try {
    const schema = Joi.object({
      projectType: Joi.string().required(),
      // phases: Joi.array().items(Joi.string().required()).required(), // Validates an array of strings
    });

    const { projectId } = req.params;
    const { projectType, phases } = req.body;

    console.log(projectId);
    console.log(projectType);
    console.log(phases);

    // const { error } = schema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

   

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { projectType, phases },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project type and phases updated successfully', data: updatedProject });
  } catch (error) {
    console.error('Error updating project type and phases:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Controller to delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ status: 200, message: 'Project deleted successfully', data: deletedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { 
    createProject, 
    getAllProjects, 
    getUserProjects,
    getProjectNameById, 
    updateProjectType,
    deleteProject,
    getProjectDetailById
};
