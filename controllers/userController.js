const userModel = require("../models/userModel");

module.exports.esmFocntion = async (req, res) => {
  try {
    //logique
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    //logique    
    const user = req.user
    const UserList = await userModel.find();

    res.status(200).json({user ,UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getOrderUsersByAge = async (req, res) => {
  try {
    //logique
    const UserList = await userModel.find().sort({ age: 1 }).limit(4);

    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserByAge = async (req, res) => {
  try {
    //logique
    const age = req.params.age;
    const UserList = await userModel.find({ age: age });

    if (UserList.length == 0) {
      throw new Error("User not Found !");
    }

    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserByAgeBetweenXAndY = async (req, res) => {
  try {
    //logique
    const { minAge, maxAge } = req.body;
    console.log(req.body);
    if (isNaN(minAge) || isNaN(maxAge)) {
      throw new Error("Not Null !");
    }
    if (minAge > maxAge) {
      throw new Error("minAge < maxAge !");
    }
    const UserList = await userModel
      .find({ age: { $gte: minAge, $lte: maxAge } })
      .sort({ age: 1 });

    if (UserList.length == 0) {
      throw new Error("User not Found !");
    }

    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    //logique
    //const id = req.body
    const id = req.params.id;
    //const id = req.query
    const User = await userModel.findById(id).populate("cars");

    res.status(200).json({ User });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClient = async (req, res) => {
  try {
    //logique
    console.log("d5al ll focntion");
    const { username, email, password, age } = req.body;
    console.log("req.body", req.body);
    const role = "client";
    const client = new userModel({ username, email, password, age, role });
    //const client = new userModel(req.body)
    const addedUser = await client.save();
    res.status(200).json(addedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addProf = async (req, res) => {
  try {
    //logique
    const { username, email, password, age } = req.body;
    console.log("req.body", req.body);
    const role = "prof";
    const client = new userModel({ username, email, password, age, role });
    //const client = new userModel(req.body)
    const addedUser = await client.save();
    res.status(200).json(addedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.DeleteUserById = async (req, res) => {
  try {
    //logique
    //const id = req.body
    const id = req.params.id;
    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("User not Found !");
    }
    //const id = req.query
    await userModel.findByIdAndDelete(id);

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.searchUsersByName = async (req, res) => {
  // ?name=John
  try {
    const { username } = req.body;

    if (!username) {
      throw new Error("Please select a name");
    }

    const userList = await userModel.find({
      username: { $regex: username, $options: "i" }, // Debut
      //firstName: {$regex : `${name}$` , $options: "i" } Fin
    });

    if (userList.length === 0) {
      throw new Error("Aucune Utilisateur trouve pour ce nom");
    }

    res.status(200).json({ userList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller/user.controller.js
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

// petit helper de nettoyage
async function cleanupUploadedFile(file) {
  try {
    if (!file) return;
    // multer.diskStorage donne généralement destination + filename
    const fullPath = file.path || path.join(file.destination, file.filename);
    await fsp.unlink(fullPath);
    console.log("[CLEANUP] Fichier supprimé :", fullPath);
  } catch (e) {
    // ignore si déjà supprimé
    if (e.code !== "ENOENT") {
      console.error("[CLEANUP] Échec suppression fichier :", e.message);
    }
  }
}

module.exports.addClientWithFile = async (req, res) => {
  try {
    const userData = { ...req.body };

    if (req.file) {
      const { filename } = req.file;
      userData.image_User = filename;
      userData.role = "client";
    }

    // (optionnel) validation business avant sauvegarde DB
    // si tu détectes un conflit, pense à nettoyer puis répondre
    // if (await userModel.exists({ email: userData.email })) {
    //   await cleanupUploadedFile(req.file);
    //   return res.status(409).json({ message: 'Email déjà utilisé' });
    // }

    const client = new userModel(userData);
    const addedUser = await client.save();
    return res.status(201).json(addedUser);
  } catch (error) {
    // IMPORTANT : nettoyer le fichier si uploadé
    await cleanupUploadedFile(req.file);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    const { username, age } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { username, age },
    });
    //const client = new userModel(req.body)
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bcrypt = require("bcrypt");

module.exports.updatePassword = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    const { password } = req.body;

    const salt = await bcrypt.genSalt();
    passwordHashed = await bcrypt.hash(password, salt);
    
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { password : passwordHashed },
    });
    //const client = new userModel(req.body)
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.updateRoleByAdminToAdmin = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { role :  "admin" },
    });
    //const client = new userModel(req.body)
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateRoleByAdminToModerateur = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { role :  "moderateur" },
    });
    //const client = new userModel(req.body)
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const jwt = require('jsonwebtoken')

const maxAge = 1 * 60 * 60 // 1 Min

const createToken = (id) =>{
  return jwt.sign({id},"net 9antra secret",{expiresIn: maxAge})
}

module.exports.login = async (req, res) => {
  try {
    //logique
    const {email , password} = req.body
    const User = await userModel.login(email,password)

    const token = createToken(User._id)
    console.log(token)

    res.cookie('jwt_Token',token,{httpOnly: false,maxAge: maxAge * 1000})

    res.status(200).json({ message:'User successfully authenticated',user:User , token : token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    //logique

    res.cookie('jwt_Token','',{ httpOnly: false,maxAge: 1})

    res.status(200).json({ message:'User successfully logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};