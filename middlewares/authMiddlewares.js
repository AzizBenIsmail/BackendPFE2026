const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const requireAuthUser = (req, res, next) => {
  const token = req.cookies.jwt_Token; //PostMan
  // const authHeader = req.headers.authorization; //FrontEnd
  // const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, "net 9antra secret", async (err, decodedToken) => {
      if (err) {
        res.json("/Problem_token");
      } else {
        const user = await userModel.findById(decodedToken.id)

        req.user = user
        next()
      }
    });
  } else {
    res.json("/pas_De_Token");
  }
};

module.exports= {requireAuthUser}