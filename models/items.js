const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
	product_name: String,
	code: Number,
	stock: String,
	in_stock: Number
});


itemsSchema.index({
	'$**': 'text'
});

const Item = mongoose.model("items", itemsSchema);

module.exports = Item;
