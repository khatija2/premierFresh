const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const fs = require("fs");
const ejs = require('ejs');
const sendEmail = require('../utils/sendEmail');
const Token = require("../models/token");
const crypto = require("crypto");

try {
	var config = require('../config');
} catch(e) {
	console.log("not local");
	console.log(e);
};


router.get("/", (req, res) => {
	res.render('login');
});


router.post("/", passport.authenticate('local', {
	successRedirect: '/products',
	failureRedirect: '/',
	failureFlash : { type: 'error', message: 'Invalid username or password.' }
}))



router.post("/password-reset", async (req, res) => {
try {
	
	async function sendPassword() {
		const confirm = await User.find({username: req.body.emailusername})
		if(confirm.length !=0) {
			if(confirm[0].email === req.body.email) {
				let token = await Token.findOne({ userId: confirm[0]._id });
        		if (!token) {
            	token = await new Token({
                userId: confirm[0]._id,
                token: crypto.randomBytes(32).toString("hex"),
            	}).save();
        		}
				const link = `${config.gmail.BASE_URL}/${confirm[0]._id}/${token.token}`;
        		await sendEmail(req.body.email, "Password reset",`Click on the following link to change your password: ${link}` 				);
				req.flash("success", "Password link sent to your email expires in 1 hour!")
				res.redirect("/")
  			} else {
			console.log("email is incorrect")
			req.flash("error", "Email address is incorrect!")
			res.redirect("/")
			}
		} else {
			console.log("user doesn't exist")
			req.flash("error", "Username is incorrect!")
			res.redirect("/")
		}	
	}
	sendPassword()
	} catch (err)  {
		console.log(err)
		req.flash("error", "Something went wrong")
		res.redirect("/")
	}
});

router.get("/:userId/:token", (req, res) => {
	const userId = req.params.userId;
	const token = req.params.token;
	res.render('password-reset', {userId, token});
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        await user.setPassword(req.body.password)
        await user.save()
		await token.delete()
		.then(() => {
		req.flash("success", "Password Reset Successfully, Please Log In!")
		res.redirect("/")
		})
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});



router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;