// routes/UserRoutes.js

const express = require('express');
const {createVideo, getVideos, getVideoById,updateVideo, deleteVideo,setActiveVideo,getRandomVideo,checkActiveVideo,updateStatus,getRandomUnwatchedVideo } = require('../controllers/VideoController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.get('/random/:videoType/:videoSubType/:projectId', getRandomUnwatchedVideo);
router.put('/:id',updateVideo);
router.put('/status/:id',updateStatus);
router.delete('/:id',deleteVideo);
router.get('/count/:userId/:projectId/:videoSubType',getRandomVideo);
router.post('/active',setActiveVideo);
router.post('/active/check',checkActiveVideo);

module.exports = router;
