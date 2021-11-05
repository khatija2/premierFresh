const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
	product_name: String,
	code: Number,
	stock: String,
});


itemsSchema.index({
	'$**': 'text'
});

const Item = mongoose.model("items", itemsSchema);

module.exports = Item;
