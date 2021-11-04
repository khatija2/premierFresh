const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');
const User = require('../models/user');


router.get("/myAccount", isLoggedIn, (req, res) => {
	res.render("account");
});


router.get("/contactUs", isLoggedIn, (req, res) => {
	res.render("contact.ejs");
});

router.get("/help", isLoggedIn, (req, res) => {
	res.render("help.ejs");
});

router.get("/terms", isLoggedIn, (req, res) => {
	res.render("terms.ejs");
});

router.get("/aboutUs", isLoggedIn, (req, res) => {
	res.render("about.ejs");
});

router.get("/newEmail", isLoggedIn, (req, res) => {
	res.render('email');
});

router.put("/newEmail/:id", isLoggedIn, async (req, res) => {
	const email = {
		email: req.body.email
	}
	try {
		const updatedEmail = await User.findByIdAndUpdate(req.params.id, email, {new: true}).exec();
		if (updatedEmail) {
		res.redirect("/myAccount")}
	} catch (err) {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/newEmail")
	}
	})

router.get("/newPassword", isLoggedIn, (req, res) => {
	res.render('password');
});

router.put("/newPassword/", isLoggedIn, async (req, res) => {
	try {
		const updatedEmail = await User.findById(req.user._id).exec()
		.then(foundUser => {
            foundUser.changePassword(req.body.oldpassword, req.body.newpassword)
		.then(() => {
		req.flash("success", "Password Changed Successfully!")
		res.redirect("/newPassword")
		})
		.catch((err) => {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/newPassword")
		})
		})
	} catch (err) {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/newPassword")
	}
	})





module.exports = router;