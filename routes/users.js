var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/users');
var Passport=require('./passport');


//signup
router.get('/register', function (req, res) {
  res.render('register');
});

//login
router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/register', function (req, res) {
  var name = req.body.name,
    username = req.body.username,
    email = req.body.email,
    password = req.body.password,
    password2 = req.body.password2;


    //req.body validation
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('username', 'username is required').notEmpty()
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('email', 'enter valid email').isEmail();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
  //  console.log('passed');
  var newUser = new User({
    name: name,
    username: username,
    email: email,
    password: password,
  })

  User.createUser(newUser, function (err, user) {
    if (err) { throw err }
    console.log(user);
  });
  req.flash('success_msg', 'you are registered to login')

  //console.log(name,email,password,password2,username);

  res.redirect('/users/login');
  }
})
  Passport.passport();

router.post('/login',
passport.authenticate('local',
 { successRedirect: '/',failureRedirect: '/users/login', failureFlash: true }),
 function(req,res){
  res.redirect('/');
 });

 //logout
 router.get('/logout',function(req,res){
   req.logout();

   req.flash('success_msg', 'You are logged out');

   res.redirect('/users/login');
 })


module.exports = router;