const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
// passport config
require('./config/passport')(passport);
//mongoose connection
mongoose.connect('mongodb://127.0.0.1/login',{ useNewUrlParser: true }, ()=>{
  console.log('connected');
})
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
//body useNewUrlParser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNI ON ${PORT}`);
})

//start from 48:18
