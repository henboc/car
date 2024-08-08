const Brand = require('../models/BrandModel');
const path = require('path');
const fs = require('fs');

const updateBrand = async (req, res) => {
  const { projectId } = req.params;
  const { font, color, brandName, vision, mission, slogan, philosophy,image } = req.body;
 
  //console.log(req.body);

  try {
    // Ensure the images directory exists
   

    // Find the existing brand by projectId
    let brand = await Brand.findOne({ projectId });

    let imagePath = '';

    // Handle image upload if provided

    if (!brand) {
      // If brand does not exist, create a new one
      brand = new Brand({
        projectId,
        font,
        color,
        brandName,
        vision,
        mission,
        slogan,
        philosophy,
      });

      await brand.save();
      res.status(200).json({ message: 'Brand created successfully', brand });
    } else {
      // If brand exists, update it
      const updateData = {
        font,
        color,
        brandName,
        vision,
        mission,
        slogan,
        philosophy,
      };

      // Update logo if a new image is uploaded
     

      const updatedBrand = await Brand.findByIdAndUpdate(brand._id, updateData, { new: true });

      res.status(200).json({ message: 'Brand updated successfully', updatedBrand });
    }
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ error: 'An error occurred while updating the brand' });
  }
};

const getBrandByprojectId = async (req, res) => {
  try {
    const projectId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const brand = await Brand.findOne({ projectId }).select('brandName vision philosophy mission slogan font color');

    // Check if the user exists
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Return the user data in the response
    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSloganByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required." });
    }

    const brand = await Brand.findOne({ projectId }, 'slogan');
    if (!brand) {
      return res.status(404).json({ error: "Brand not found." });
    }

    res.status(200).json({ slogan: brand.slogan });
  } catch (error) {
    console.error('Error fetching slogan:', error);
    res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = { 
  updateBrand,
  getBrandByprojectId,
  getSloganByProjectId
};
