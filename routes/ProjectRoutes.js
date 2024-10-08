const express = require('express');
const { createProject, getAllProjects,getProjectNameById,getUserProjects,updateProjectType,deleteProject,getProjectDetailById } = require('../controllers/ProjectController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();
console.log("projects dd");
router.post('/', AuthRoutes.verifyTokenUser,createProject);
router.get('/:id', AuthRoutes.verifyTokenUser,getUserProjects);
router.get('/project/:id', AuthRoutes.verifyTokenUser,getProjectDetailById);
router.get('/user/:id', AuthRoutes.verifyTokenUser,getProjectNameById);
router.put('/type/:projectId', AuthRoutes.verifyTokenUser,updateProjectType);
// router.get('/:id', AuthRoutes.verifyTokenAdmin,getAllProjects);
router.delete('/:id', AuthRoutes.verifyTokenUser,deleteProject);

module.exports = router;
