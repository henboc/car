const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  brandName: { type: String },
  vision: { type: String },
  mission: { type: String },
  slogan: { type: String },
  philosophy: { type: String },
  font: { type: String },
  color: { type: String },
  logo: { type: String }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
