const User = require('../models/user');

const adminRedirect = async (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.username  !== "admin") {
			next();
		} else {
			res.redirect("/admin/productList");
		}
	} else {
		res.redirect("/");
	}
}

module.exports = adminRedirect;