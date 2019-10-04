const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('./login');
});

router.get('/register', (req, res) => {
  res.render("./register");
});

router.post('/register', (req, res) =>{
   // console.log(req.body);
  // console.log(req.body.email);
  // res.send("hello")
const {name, email, password, password2} = req.body;
let errors = [];
if(!name || !email || !password || !password2)
{
  errors.push({ msg: 'please fill in all detatils'});
}


if( password !== password2)
{
  errors.push({ msg: 'Password do not match'});
}

if( password.length < 6)
{
  errors.push({ msg: 'password should be atleast 6 characters'});
}

if (errors.length>0) {
  res.render('register',{
    errors,
    name,
    email,
    password,
    password2
  });
}else {
//validatio passed
User.findOne({email: email}).then(user =>{
  if (user) {
    //user exist
    errors.push({msg: 'user already exist' });
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else{
    const newUser = new User({
      name,
      email,
      password
    });
    console.log(newUser);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) console.log(err);
        newUser.password = hash;
        //save User
        newUser.save().then(user => {
          res.redirect('/users/login');
        }).catch(err => console.log(err));
      });
    });
    // res.send('hello')
  }
});
//hash password

}

});
//login handle

router.post('/login', (req, res, next) =>{
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect:'/users/login',

  })(req, res, next);
});

router.get('/logout', (req, res) =>{
  req.logout();
  res.redirect('/users/login');
})

module.exports = router;
