var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const uploadfile = require('../middlewares/uploadFile')
const {requireAuthUser} = require("../middlewares/authMiddlewares")

/* GET home page. */
router.get('/getAllUsers',requireAuthUser,userController.getAllUsers )
router.get('/getOrderUsersByAge',requireAuthUser,userController.getOrderUsersByAge )
router.get('/searchUsersByUsername',requireAuthUser,userController.searchUsersByName )
router.get('/getUserByAgeBetweenXAndY',requireAuthUser,userController.getUserByAgeBetweenXAndY )
router.get('/getUserByAge/:age',requireAuthUser,userController.getUserByAge )
router.get('/getUserById/:id',requireAuthUser,userController.getUserById )
router.post('/addClient',userController.addClient )
router.post('/login',userController.login )
router.post('/logout',requireAuthUser,userController.logout )
router.post('/addClientWithFile',uploadfile.single("image_User"),userController.addClientWithFile )
router.post('/addProf',requireAuthUser,userController.addProf )
router.delete('/DeleteUserById/:id',requireAuthUser,userController.DeleteUserById )

module.exports = router;
