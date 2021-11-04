//==========================
//IMPORTS
//==========================
//npm imports
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const expressSession = require('express-session');
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
require('dotenv').config({ path: './.env' });


//config imports
/*try {
	var config = require('./config');
} catch(e) {
	console.log("not local");
	console.log(e);
};*/



const mongoose = require('mongoose');

/*try {
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
} catch(e) {
	console.log("not connected to config");
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
}

*/

mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})


//========================
//model imports
//========================
const Item = require('./models/items');
const User = require('./models/user');
const Order = require('./models/order');
const Token = require('./models/token');


//===========================
//DEV
//===========================


//=========================
//CONFIG
//=========================

//express session config
app.use(expressSession({
		secret: process.env.ES_SECRET //|| config.expressSession.secret,
		resave: false,
		saveUninitialized: false
		}));

//flash
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session()); //allows persistent sessions
passport.serializeUser(User.serializeUser()); //encodes data into session  (from passport-local-mongoose)
passport.deserializeUser(User.deserializeUser());//decondes from session
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(User.authenticate()));


//state middleware config
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})


//route imports
const productRoutes = require('./routes/products');
const mainRoutes = require('./routes/main');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');


app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.use(productRoutes);
app.use(mainRoutes);
app.use(cartRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);


//===========================
//LISTEN
//===========================

app.listen()

/*app.listen(process.env.PORT || 3000, () => {
	console.log("Listening on port 3000");
});*/


