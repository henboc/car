// routes/ndaRoutes.js
const express = require('express');
const router = express.Router();
const AuthRoutes = require('../authMiddleware');
const ndaController = require('../controllers/NdaController');

// Get all NDAs
router.get('/', AuthRoutes.verifyTokenUser,ndaController.getAllNdas);

// Get NDA by ID
router.get('/:id', AuthRoutes.verifyTokenUser,ndaController.getNdaById);

// Get NDA by projectId
router.get('/project/:projectId', AuthRoutes.verifyTokenUser, ndaController.getNdaByProjectId);

// Create a new NDA
router.post('/', AuthRoutes.verifyTokenUser,ndaController.createNda);

// Update an NDA
router.put('/:projectId', AuthRoutes.verifyTokenUser, ndaController.updateNda);

// Delete an NDA
router.delete('/:id', AuthRoutes.verifyTokenUser,ndaController.deleteNda);

module.exports = router;
