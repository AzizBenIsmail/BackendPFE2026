const Car = require('../models/carModel');

class CarService {
  // Créer une nouvelle voiture
  static async createCar(carData) {
    const existingCar = await Car.findOne({ matricule: carData.matricule });
    if (existingCar) {
      throw new Error('Une voiture avec ce matricule existe déjà');
    }
    
    const newCar = new Car(carData);
    return await newCar.save();
  }

  // Récupérer toutes les voitures
  static async getAllCars() {
    return await Car.find().sort({ createdAt: -1 });
  }

  // Récupérer une voiture par ID
  static async getCarById(id) {
    const car = await Car.findById(id);
    if (!car) {
      throw new Error('Voiture non trouvée');
    }
    return car;
  }

  // Rechercher des voitures par critères
  static async searchCars(filters) {
    const filter = {};
    
    if (filters.brand) filter.brand = { $regex: filters.brand, $options: 'i' };
    if (filters.model) filter.model = { $regex: filters.model, $options: 'i' };
    if (filters.year) filter.year = filters.year;
    if (filters.color) filter.color = { $regex: filters.color, $options: 'i' };
    
    return await Car.find(filter).sort({ createdAt: -1 });
  }

  // Mettre à jour une voiture
  static async updateCar(id, updateData) {
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
  }

  // Supprimer une voiture
  static async deleteCar(id) {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      throw new Error('Voiture non trouvée');
    }
    return car;
  }

  // Supprimer toutes les voitures
  static async deleteAllCars() {
    return await Car.deleteMany({});
  }

  // Statistiques des voitures
  static async getCarStats() {
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
  }
}

module.exports = CarService;
