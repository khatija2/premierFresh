const mongoose = require('mongoose');

const autoIncrementModelID = require('./counter');

const orderSchema = new mongoose.Schema({
	order: {type: Object, required: true},
	bag: String,
	orderId: Number,
	updated: { type: Date, default: Date.now },
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

orderSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('activities', this, next);
});





const Order = mongoose.model("orders", orderSchema);




module.exports = Order;