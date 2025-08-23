const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  brand: String,
  matricule: {
    type: String,
    required: true,
    unique:true,
    match: [/^\d{4}TUN\d{3}$/, "Le matricule doit être de la forme 9999TUN999"],
  },
  color: {type :String , default:"#0000"},
  model: String,
  year: Number,
  owner: {type : mongoose.Schema.Types.ObjectId ,ref: "User"}, //One 
  //owners: [{type : mongoose.Schema.Types.ObjectId ,ref: "User"}] //Many 
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
