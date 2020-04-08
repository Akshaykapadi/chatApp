const express = require("express");
const bodyParser = require("body-parser");
const Chats = require("./../models/Chat");
const jwt = require('jsonwebtoken');


const router = express.Router();
const User = require("./../models/User");


router.route("/").get(async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  console.log('auth',req.headers.authorization,req.headers.authorization.length);
  
  if(req.headers.authorization.length > 0){
    
    const decodedToken = jwt.verify(req.headers.authorization, 'RANDOM_TOKEN_SECRET');
    console.log('hi',decodedToken);
    const userId = decodedToken.userId;
    var userDetails =  await User.findOne({ _id: userId });

    if(Object.keys(userDetails).length === 0){
      console.log('worfg1234');
      res.status(401).json({
        status : 401,
        message : 'Unauthorised user'
      });
    }else{
      Chats.find().limit(100).sort({KEY:1}).then(chat => {
        res.json(chat);
      });
    }

    
  }else{
    console.log('worfg');
    res.status(401).json({
      status : 401,
      message : 'Unauthorised user'
    });
  }
  
 
  

    
  
});

module.exports = router;