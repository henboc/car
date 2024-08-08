// models/QuestionSubCategory.js
const mongoose = require('mongoose');

const QuestionSubCategorySchema = new mongoose.Schema({
  subCategory: { type: String, required: true },
  order: { type: Number, required: true },
  category: { type: String, required: true }
});

const QuestionSubCategory = mongoose.model('QuestionSubCategory', QuestionSubCategorySchema);

module.exports = QuestionSubCategory;
