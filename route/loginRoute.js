const express = require("express");
const jwt = require('jsonwebtoken');
const User = require("./../models/User");

const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next(); 
});

router.get('/test',(req, res) => 
res.json(
    {msg:'API is working.'}
));


router.post('/',(req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    console.log(req.body);
    User.findOne({ username: req.body.username }).then(
        (user) => {
          console.log('user',user);
          if (!user) {
            return res.status(202).json({
              message: 'User not found!',
              status : 202
            });
          }
          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          res.status(200).json({
            status : 200,
            userId: user._id,
            token: token,
            userName:req.body.username,
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
    
  });

  router.post('/create',(req,res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    let createUser = new User({ username: req.body.username});
    createUser.save(function(err,doc){
      if(err){
        return res.status(202).json({
          message: 'Could not create user!',
          status : 202
        });
      }else{
        const token = jwt.sign(
          { userId: doc._id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' });
        res.status(200).json({
          status : 200,
          userId: doc._id,
          token: token,
          userName:req.body.username,
        });
      }
    });
  });
  
  

  module.exports = router;