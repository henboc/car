const express = require('express');
const router = express.Router();
const AuthRoutes = require('../authMiddleware');
const {getHubs,getTypes, getTypeDetails,getSubtypeFiles,getHubsByProjectId,getAllFilesByTimelineId,getTypeDetailsProject,createBrandUpload} = require('../controllers/HubController');

// Define route for saving graph data
router.post('/brand', AuthRoutes.verifyTokenUser, createBrandUpload);
router.get('/', getHubs);
router.get('/types/:projectId', getTypes);
router.get('/files/:timelineId', getAllFilesByTimelineId);
router.get('/project/:projectId', getHubsByProjectId);
router.get('/types/:type', getTypeDetails);
router.get('/types/project/:type/:projectId', getTypeDetailsProject);
router.get('/types/:type/:subtype', getSubtypeFiles);

module.exports = router;
