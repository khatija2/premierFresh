const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user');
const passport = require('passport');
const Item = require('../models/items');
const Order = require('../models/order');
const checkAdmin = require('../utils/checkAdmin');


//admin login
router.get("/", (req, res) => {
	res.render('admin-login');
});

//admin auth
router.post("/", passport.authenticate('local', {
	successRedirect: '/admin/productList',
	failureRedirect: '/admin',
	failureFlash : { type: 'error', message: 'Invalid username or password.' }
}));

//admin logout
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

//show route
router.get("/productList",  checkAdmin, async (req, res) => {
	try {
		const items = await Item.find().sort({ product_name: 1 });
		const maxCode = await Item.find().sort({code: -1}).limit(1)
		const addCode = parseInt(maxCode[0].code) + 1
		const newCode = addCode.toString()
		res.render("productList", {items, newCode});
	} catch (err) {
		console.log(err);
		res.redirect('back')
	}
})

//post route
router.post("/productList", checkAdmin, async (req, res) => {
	const item = {
		product_name: req.body.product_name,
		code: req.body.code,
		stock: req.body.stock
	}
try {
	const items = await Item.create(item);
	res.redirect("/admin/productList")	
} catch (err) {
	req.flash("error", "Error Submitting Request!");
	res.redirect("/admin/productList")
}
})

//search route
router.get("/productList/search", checkAdmin, async (req, res) => {
	try {
		const items = await Item.find({
			$text: {
				$search: req.query.term
			}
		})
		res.render("productList", {items})
	} catch (err) {
		console.log(err);
		res.redirect("/admin/productList")
	}
})

//edit route
router.get("/productList/:id/edit", checkAdmin, async (req, res) => {
	try {
	const items = await Item.find().exec();
	const item = await Item.findById(req.params.id).exec();
	res.render("productList_edit", {items, item});
	} catch (err) {
		console.log(err);
		res.redirect("/admin/productList")
	}
})

//update route
router.put("/productList/:id", checkAdmin, async (req, res) => {
	const item = {
		product_name: req.body.product_name,
		code: req.body.code,
		stock: req.body.stock
	}
	try {
		const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {new: true}).exec();
		res.redirect("/admin/productList")
	} catch (err) {
		req.flash("error", "Error Submitting Request!");
		res.redirect("/admin/productList")
	}
	})


//delete request
router.get("/productList/:id/delete", checkAdmin, async (req, res) => {
try {
	const items = await Item.find().exec();
	const item = await Item.findById(req.params.id).exec()
	res.render("productList_del", {items, item});
	} catch (err) {
		console.log(err);
		res.redirect("/admin/productList")
	}
})


//delete route
router.delete("/productList/:id", checkAdmin, async (req, res) => {
	try {
		const deletedItem = await Item.findByIdAndDelete(req.params.id).exec();
		res.redirect("/admin/productList")
	} catch (err) {
		req.flash("error", "Error Deleting Product!");
		res.redirect("/admin/productList")
	}
	})

//get all orders
router.get("/orders", checkAdmin, async (req, res) => {
		try {
		const orders = await Order.find().sort({ orderId: -1 })
		res.render("admin-orders", {orders});
	} catch (err) {
		console.log(err);
		res.redirect('back');
	}
})

router.delete("/orders/delete", checkAdmin, async (req, res) => {
		try {
		const deletedOrders = await Order.deleteMany( { updated : {"$lt" : new Date(Date.now() - 60*24*60*60 * 1000) } });
		res.redirect("/admin/orders")
	} catch (err) {
		console.log(err)
		req.flash("error", "Error Deleting Orders!");
		res.redirect("/admin/orders")
	}
	})

router.get("/orders/search", checkAdmin, async (req, res) => {
	try {
		const orders = await Order.find({
			"owner.username" : req.query.term
		})
		res.render("admin-orders", {orders})
	} catch (err) {
		console.log(err);
		res.redirect("/admin/orders")
	}
})






//order
router.get("/order/:id", checkAdmin, async (req, res) => {
	try {
		const inv = await Order.findById(req.params.id).exec();
		const orderList = await Order.findById(req.params.id)
		.exec()
		.then((result) => {
		let boo = result.order
		return boo
		})
		res.render("adminorder", {orderList, inv});
	} catch (err) {
		console.log(err);
		res.redirect('back');
	}
});

router.get("/dailyOrders", checkAdmin, (req, res) => {
	res.render('admin-select');
});

router.get("/daily", checkAdmin, (req, res) => {
	res.render('admin-daily');
});


router.post("/daily", checkAdmin, async (req, res) => {
try {
	

	
  const selectedDate = req.body.date
	
  const addDay = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const addOne = await addDay(req.body.date, 1)


const dailysum = await Order.aggregate(
	[
  {
    '$match': {
      'updated': {
        '$gte': new Date(req.body.date), 
        '$lte': new Date(addOne)
      }
    }
  }, {
    '$unwind': {
      'path': '$order'
    }
  }, {
    '$group': {
      '_id': '$order.productName', 
		'code': {
        '$last': '$order.id'
      }, 
      'total': {
        '$sum': {
          '$toInt': '$order.amount'
        }
      }
    }
  }, {
    '$sort': {
      '_id': 1
    }
  }
]
)



res.render("admin-daily", {dailysum, selectedDate})
	
} catch (err) {
	req.flash("error", "Error Submitting Request!");
	res.redirect("/admin/dailyOrders")
}
})


router.get("/users", checkAdmin, async (req, res) => {
		try {
		const users = await User.find()
		.exec()
		res.render("users", {users});
	} catch (err) {
		console.log(err);
		res.redirect('back');
	}
})


//delete  user route
router.delete("/users/:id", checkAdmin, async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id).exec();
		res.redirect("/admin/users")
	} catch (err) {
		req.flash("error", "Error Deleting User!");
		res.redirect("/admin/users")
	}
	})

router.get("/signup", checkAdmin, (req, res) => {
	res.render('signUp');
});

router.post("/signup", checkAdmin,  async (req, res) => {
	try {
		const newUser = await User.register(new User (
		{
			username: req.body.username,
			email: req.body.email,	
		}
		), 
		req.body.password
		);
		if (newUser) {
		res.redirect("/admin/users")}
	} catch (err) {
		if (err.name === 'UserExistsError'){
		req.flash("error", err.message)
		}
		else if (err._message === 'user validation failed'){
		req.flash("error", "Please fill in a valid email address!")}
		else {
		req.flash("error", err.message)
		}
		res.redirect("/admin/signup");
		
		
	}
})


router.get("/myAccount", checkAdmin, (req, res) => {
	res.render("adminaccount");
});

router.get("/newEmail", checkAdmin, (req, res) => {
	res.render('adminemail');
});

router.put("/newEmail/:id", checkAdmin, async (req, res) => {
	const email = {
		email: req.body.email
	}
	try {
		const updatedEmail = await User.findByIdAndUpdate(req.params.id, email, {new: true}).exec();
		if (updatedEmail) {
		res.redirect("/admin/myAccount")}
	} catch (err) {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/admin/newEmail")
	}
	})

router.get("/newPassword", checkAdmin, (req, res) => {
	res.render('adminpassword');
});

router.put("/newPassword", checkAdmin, async (req, res) => {
	try {
		const updatedEmail = await User.findById(req.user._id).exec()
		.then(foundUser => {
            foundUser.changePassword(req.body.oldpassword, req.body.newpassword)
		.then(() => {
		req.flash("success", "Password Changed Successfully!")
		res.redirect("/admin/newPassword")
		})
		.catch((err) => {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/admin/newPassword")
		})
		})
	} catch (err) {
		console.log(err)
		req.flash("error", err.message);
		res.redirect("/admin/newPassword")
	}
	})







module.exports = router;