// routes/UserRoutes.js
const express = require('express');
const { updateBrand,getBrandByprojectId,getSloganByProjectId } = require('../controllers/BrandController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/:projectId',AuthRoutes.verifyTokenUser,updateBrand);
router.get('/:id',AuthRoutes.verifyTokenUser,getBrandByprojectId);
router.get('/slogan/:projectId',AuthRoutes.verifyTokenUser,getSloganByProjectId);
module.exports = router;
