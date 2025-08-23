const express = require('express');
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  searchCars,
  updateCar,
  deleteCar,
  deleteAllCars
} = require('../controllers/carController');

// Routes CRUD pour les voitures

// CREATE - Créer une nouvelle voiture
router.post('/', createCar);

// READ - Récupérer toutes les voitures
router.get('/', getAllCars);

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
