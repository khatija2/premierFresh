const User = require('../models/user');

const checkAdmin = async (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.username  === "admin") {
			next();
		} else {
			req.flash("error", "You are not authorised!")
			res.redirect("/admin");
		}
	} else {
		res.redirect("/admin");
	}
}

module.exports = checkAdmin;