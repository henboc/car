const mongoose = require('mongoose');
const Video = require('../models/VideoModel'); // Adjust the path as needed
const WatchedVideo = require('../models/WatchedVideoModel');
// Create a new video
const createVideo = async (req, res) => {
    console.log("video");
  try {
    const { videoType, videoSubType, videoLink, videoOrder, videoTime } = req.body;

    // Check that each value exists
    if (!videoType || !videoSubType || !videoLink || !videoOrder || !videoTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newVideo = new Video({
      videoType,
      videoSubType,
      videoLink,
      videoOrder,
      videoTime
    });

    await newVideo.save();
    res.status(200).json({ message: 'Video created successfully', video: newVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a video by ID
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoType, videoSubType, videoLink, videoOrder, videoTime } = req.body;

    // Check that each value exists
    if (!videoType || !videoSubType || !videoLink || !videoOrder || !videoTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { videoType, videoSubType, videoLink, videoOrder, videoTime },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a video by ID
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countVideosBySubType  = async (req, res) => {
  try {
      const { videoSubType } = req.params;
      const count = await Video.countDocuments({ videoSubType });
      res.status(200).json({ status:200, message: 'Video counted', count:count });
  } catch (error) {
      console.error('Error counting videos by subtype:', error);
      throw error;
  }
}


const getRandomVideo = async (req, res) => {
  try {
    const { userId, projectId, videoSubType } = req.params;

    // Get the count of all videos of the same videoSubType
    const totalVideosCount = await Video.countDocuments({ videoSubType });

    console.log("totalVideosCount");
    console.log(totalVideosCount);

    if (totalVideosCount === 0) {
      return res.status(404).json({ error: 'No videos available to watch ' });
    }

    // Get the IDs of videos the user has already watched in this subType and project
    const watchedVideos = await WatchedVideo.find({ userId, projectId, videoSubType }).select('videoId');
    const watchedVideoIds = watchedVideos.map(v => v.videoId);

    // Get the count of unwatched videos
    const unwatchedVideosCount = totalVideosCount - watchedVideoIds.length;

    if (unwatchedVideosCount === 0) {
      return res.status(404).json({ error: 'No unwatched videos available' });
    }

    // Get a random unwatched video
    const random = Math.floor(Math.random() * unwatchedVideosCount);
    const unwatchedVideo = await Video.findOne({ 
      videoSubType,
      _id: { $nin: watchedVideoIds } 
    }).skip(random);

    console.log(unwatchedVideo);
    if (unwatchedVideo) {
      res.status(200).json({ status:200, video: unwatchedVideo });
      
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error getting random video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const setActiveVideo = async (req, res) => {
  try {
    const { userId, projectId, videoId, videoSubType } = req.body;

    // Find the video by ID to ensure it exists
    const video = await Video.findById(videoId);
    console.log(req.body);
   

    // Create or update the watched video record to set it as active

    const newVideo = new WatchedVideo({
      userId,
      projectId,
      videoId,
      videoSubType,
      videoStatus:'done'
    });

    await newVideo.save();
    res.json({ message: 'Active video set successfully', video:newVideo });
  } catch (error) {
    console.error('Error setting active video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const checkActiveVideo = async (req, res) => {
  try {
    const { userId, projectId, videoSubType } = req.body;

    console.log("checking Active");
    console.log("checking Active cache");
    console.log(req.body)

    // Find the active video with the given parameters
    const activeVideo = await WatchedVideo.findOne({
      userId,
      projectId,
      videoSubType,
      videoStatus: 'active'
    }).populate('videoId');

    console.log(activeVideo);

    if (activeVideo) {
      res.json({ status: 200, active: true, video: activeVideo });
    } else {
      res.json({ status: 200, active: false });
    }
  } catch (error) {
    console.error('Error checking active video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id } = req.params;
   

    console.log(id);

    

    // Authenticate the user using their current credentials
    const watchedVideo = await WatchedVideo.findById(id);

    if (!watchedVideo) {
      return res.status(404).json({ error: 'watched Video not found' });
    }

    watchedVideo.videoStatus = "done";
    await watchedVideo.save();

    res.json({ status: 200, message: 'Status Changed Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  const getRandomUnwatchedVideo = async (req, res)  => {
  try {
    // Fetch all videos of the specific type and subtype
    const { videoType, videoSubType,projectId } = req.params;
    const allVideos = await Video.find({ videoType, videoSubType });

    // Fetch watched videos for the given user, project, type, and subtype
    const watchedVideos = await WatchedVideo.find({
      projectId,
      videoSubType,
      videoStatus: 'watched' // Assuming 'videoStatus' indicates if the video was watched
    }).select('videoId');

    // Create a set of watched video IDs
    const watchedVideoIds = new Set(watchedVideos.map(video => video.videoId.toString()));

    // Filter out watched videos from the list of all videos
    const unwatchedVideos = allVideos.filter(video => !watchedVideoIds.has(video._id.toString()));

    // If there are no unwatched videos, return null or handle accordingly
    if (unwatchedVideos.length === 0) {
      return null;
    }

    // Return a random unwatched video
    const randomIndex = Math.floor(Math.random() * unwatchedVideos.length);
    return unwatchedVideos[randomIndex];
  } catch (error) {
    console.error('Error fetching random unwatched video:', error);
    throw error;
  }
}

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  countVideosBySubType,
  getRandomVideo,
  setActiveVideo,
  checkActiveVideo,
  updateStatus,
  getRandomUnwatchedVideo
};

