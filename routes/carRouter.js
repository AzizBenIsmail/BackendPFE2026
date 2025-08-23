const express = require('express');
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  searchCars,
  updateCar,
  deleteCar,
  deleteAllCars,
  getCarStats,
  addCarWithOwner
} = require('../controllers/carController');

// Routes CRUD pour les voitures

// CREATE - Créer une nouvelle voiture
router.post('/addCarWithOwner', addCarWithOwner);

// READ - Récupérer toutes les voitures
router.get('/', getAllCars);

// READ - Statistiques des voitures
router.get('/stats', getCarStats);

// READ - Rechercher des voitures par critères
router.get('/search', searchCars);

// READ - Récupérer une voiture par ID
router.get('/:id', getCarById);

// UPDATE - Mettre à jour une voiture
router.put('/:id', updateCar);

// DELETE - Supprimer une voiture
router.delete('/:id', deleteCar);

// DELETE - Supprimer toutes les voitures (optionnel, à utiliser avec précaution)
router.delete('/', deleteAllCars);

module.exports = router;
