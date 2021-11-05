const express = require('express');
const router = express.Router({mergeParams:true});
const bodyParser = require('body-parser');
const Order = require('../models/order');
const isLoggedIn = require('../utils/isLoggedIn');
const fs = require("fs");
const ejs = require('ejs');
const sendEmail = require('../utils/sendEmail');

router.get("/pastOrders", isLoggedIn, async (req, res) => {
		try {
		const ownerOrder = await Order.find({"owner.id": req.user._id })
		.exec()
		res.render("history", {ownerOrder});
	} catch (err) {
		res.redirect('back');
	}
})

router.get("/myCart", isLoggedIn, (req, res) => {
	 res.render("cart");
});

router.get("/order/:id", isLoggedIn, async (req, res) => {
	try {
		const inv = await Order.findById(req.params.id).exec();
		const orderList = await Order.findById(req.params.id)
		.exec()
		.then((result) => {
		let boo = result.order
		return boo
		})
		res.render("order", {orderList, inv});
	} catch (err) {
		console.log(err);
		res.redirect('back');
	}
});


router.post("/myCart", isLoggedIn, async (req, res) => {
const order = {
	order: JSON.parse(req.body.order),
	bag: req.body.bag,
	owner: {
		id: req.user._id,
		username: req.user.username
	}
	}
try {
	const orders = await Order.create(order);
	
	const data = await ejs.renderFile("views/test.ejs", {orders});
	
	const email = [req.user.email, process.env.PF_MAIL]
	
	sendEmail(email, 'Your Premier Fresh Produce Order', "Log in to your account to view your Order", data)	

	req.flash("success", "Order Submitted!");
	res.redirect("/myCart")
} catch (err) {
	console.log(err)
	req.flash("error", "Error Submitting Order!");
	res.redirect("/myCart")
}
})

module.exports = router;