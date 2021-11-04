const express = require('express');
const router = express.Router({mergeParams:true});
const isLoggedIn = require('../utils/isLoggedIn');
const adminRedirect = require('../utils/adminRedirect');


const Item = require('../models/items');



//show route with filter in stock
router.get("/products", adminRedirect, async (req, res) => {
	try {
		const items = await Item.find({stock: "on"}).sort({ product_name: 1 });
		res.render("products", {items});
	} catch (err) {
		console.log(err)
		res.redirect('back');
	}
})

//search route
router.get("/products/search", isLoggedIn, async (req, res) => {
	try {
		const items = await Item.find({stock: "on",
				 $text: {
				$search: req.query.term
			}
		})
		res.render("products", {items});
	} catch (err) {
		res.redirect("/products");
	}
})







module.exports = router;