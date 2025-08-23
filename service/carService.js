const Car = require('../models/carModel');

// Créer une nouvelle voiture
module.exports.createCar = async (carData) => {
  const existingCar = await Car.findOne({ matricule: carData.matricule });
  if (existingCar) {
    throw new Error('Une voiture avec ce matricule existe déjà');
  }
  
  const newCar = new Car(carData);
  return await newCar.save();
};

// Récupérer toutes les voitures
module.exports.getAllCars = async () => {
  return await Car.find().sort({ createdAt: -1 });
};

// Récupérer une voiture par ID
module.exports.getCarById = async (id) => {
  const car = await Car.findById(id);
  if (!car) {
    throw new Error('Voiture non trouvée');
  }
  return car;
};

// Rechercher des voitures par critères
module.exports.searchCars = async (filters) => {
  const filter = {};
  
  if (filters.brand) filter.brand = { $regex: filters.brand, $options: 'i' };
  if (filters.model) filter.model = { $regex: filters.model, $options: 'i' };
  if (filters.year) filter.year = filters.year;
  if (filters.color) filter.color = { $regex: filters.color, $options: 'i' };
  
  return await Car.find(filter).sort({ createdAt: -1 });
};

// Mettre à jour une voiture
module.exports.updateCar = async (id, updateData) => {
  const existingCar = await Car.findById(id);
  if (!existingCar) {
    throw new Error('Voiture non trouvée');
  }
  
  // Vérifier l'unicité du matricule si modifié
  if (updateData.matricule && updateData.matricule !== existingCar.matricule) {
    const carWithSameMatricule = await Car.findOne({ matricule: updateData.matricule });
    if (carWithSameMatricule) {
      throw new Error('Une voiture avec ce matricule existe déjà');
    }
  }
  
  return await Car.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

// Supprimer une voiture
module.exports.deleteCar = async (id) => {
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    throw new Error('Voiture non trouvée');
  }
  return car;
};

// Supprimer toutes les voitures
module.exports.deleteAllCars = async () => {
  return await Car.deleteMany({});
};

// Statistiques des voitures
module.exports.getCarStats = async () => {
  const totalCars = await Car.countDocuments();
  const carsByBrand = await Car.aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  const carsByYear = await Car.aggregate([
    { $group: { _id: '$year', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  return {
    totalCars,
    carsByBrand,
    carsByYear
  };
};
