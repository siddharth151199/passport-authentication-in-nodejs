const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
new LocalStrategy({ usernameField: 'email'}, (email, password, done)=>{
  //match users
  User.findOne({email: email }).then(user =>{
    if(!user) {
      return done(null, false, { message: 'that email is not register'});
    }
    //match password
    bcrypt.compare(password, user.password, (err, isMatch) =>{
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        return done(null, user);
      }else{
        return done(null, false, { message: 'password incorrect'});
      }
    });
  }).catch(err => console.log(err));


})

  );

  passport.serializeUser((user, done)  =>{
  done(null, user.id);
});

passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
}
