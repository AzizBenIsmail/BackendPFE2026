const Car = require('../models/carModel');

// CREATE - Créer une nouvelle voiture
const createCar = async (req, res) => {
  try {
    const { brand, matricule, color, model, year } = req.body;
    
    // Vérifier si la voiture existe déjà avec ce matricule
    const existingCar = await Car.findOne({ matricule });
    if (existingCar) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une voiture avec ce matricule existe déjà' 
      });
    }

    const newCar = new Car({
      brand,
      matricule,
      color,
      model,
      year
    });

    const savedCar = await newCar.save();
    
    res.status(201).json({
      success: true,
      message: 'Voiture créée avec succès',
      data: savedCar
    });
  } catch (error) {
    console.error('Erreur lors de la création de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la voiture',
      error: error.message
    });
  }
};

// READ - Récupérer toutes les voitures
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    
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
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await Car.findById(id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Voiture récupérée avec succès',
      data: car
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la voiture',
      error: error.message
    });
  }
};

// READ - Rechercher des voitures par critères
const searchCars = async (req, res) => {
  try {
    const { brand, model, year, color } = req.query;
    const filter = {};
    
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (model) filter.model = { $regex: model, $options: 'i' };
    if (year) filter.year = year;
    if (color) filter.color = { $regex: color, $options: 'i' };
    
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    
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
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, matricule, color, model, year } = req.body;
    
    // Vérifier si la voiture existe
    const existingCar = await Car.findById(id);
    if (!existingCar) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    
    // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
    if (matricule && matricule !== existingCar.matricule) {
      const carWithSameMatricule = await Car.findOne({ matricule });
      if (carWithSameMatricule) {
        return res.status(400).json({
          success: false,
          message: 'Une voiture avec ce matricule existe déjà'
        });
      }
    }
    
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { brand, matricule, color, model, year },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Voiture mise à jour avec succès',
      data: updatedCar
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la voiture',
      error: error.message
    });
  }
};

// DELETE - Supprimer une voiture
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await Car.findByIdAndDelete(id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Voiture supprimée avec succès',
      data: car
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la voiture',
      error: error.message
    });
  }
};

// DELETE - Supprimer toutes les voitures
const deleteAllCars = async (req, res) => {
  try {
    const result = await Car.deleteMany({});
    
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

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  searchCars,
  updateCar,
  deleteCar,
  deleteAllCars
};
