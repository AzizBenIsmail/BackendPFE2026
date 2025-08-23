const CarService = require('../service/carService');

// CREATE - Créer une nouvelle voiture
module.exports.createCar = async (req, res) => {
  try {
    const { brand, matricule, color, model, year } = req.body;
    
    const savedCar = await CarService.createCar({
      brand,
      matricule,
      color,
      model,
      year
    });
    
    res.status(201).json({
      success: true,
      message: 'Voiture créée avec succès',
      data: savedCar
    });
  } catch (error) {
    console.error('Erreur lors de la création de la voiture:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la voiture',
      error: error.message
    });
  }
};

// READ - Récupérer toutes les voitures
module.exports.getAllCars = async (req, res) => {
  try {
    const cars = await CarService.getAllCars();
    
    res.status(200).json({
      success: true,
      message: 'Voitures récupérées avec succès',
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des voitures',
      error: error.message
    });
  }
};

// READ - Récupérer une voiture par ID
module.exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await CarService.getCarById(id);
    
    res.status(200).json({
      success: true,
      message: 'Voiture récupérée avec succès',
      data: car
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la voiture:', error);
    if (error.message === 'Voiture non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la voiture',
      error: error.message
    });
  }
};

// READ - Rechercher des voitures par critères
module.exports.searchCars = async (req, res) => {
  try {
    const { brand, model, year, color } = req.query;
    
    const cars = await CarService.searchCars({
      brand,
      model,
      year,
      color
    });
    
    res.status(200).json({
      success: true,
      message: 'Recherche effectuée avec succès',
      count: cars.length,
      data: cars
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des voitures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des voitures',
      error: error.message
    });
  }
};

// UPDATE - Mettre à jour une voiture
module.exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, matricule, color, model, year } = req.body;
    
    const updatedCar = await CarService.updateCar(id, {
      brand,
      matricule,
      color,
      model,
      year
    });
    
    res.status(200).json({
      success: true,
      message: 'Voiture mise à jour avec succès',
      data: updatedCar
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la voiture:', error);
    if (error.message === 'Voiture non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    if (error.message === 'Une voiture avec ce matricule existe déjà') {
      return res.status(400).json({
        success: false,
        message: 'Une voiture avec ce matricule existe déjà'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la voiture',
      error: error.message
    });
  }
};

// DELETE - Supprimer une voiture
module.exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await CarService.deleteCar(id);
    
    res.status(200).json({
      success: true,
      message: 'Voiture supprimée avec succès',
      data: car
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture:', error);
    if (error.message === 'Voiture non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la voiture',
      error: error.message
    });
  }
};

// DELETE - Supprimer toutes les voitures
module.exports.deleteAllCars = async (req, res) => {
  try {
    const result = await CarService.deleteAllCars();
    
    res.status(200).json({
      success: true,
      message: 'Toutes les voitures ont été supprimées avec succès',
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les voitures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de toutes les voitures',
      error: error.message
    });
  }
};

// GET - Statistiques des voitures
module.exports.getCarStats = async (req, res) => {
  try {
    const stats = await CarService.getCarStats();
    
    res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
