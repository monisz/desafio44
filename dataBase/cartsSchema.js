const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema({
    timestamp: {type: Date, require: true},
    id: {type: Number, require: true},
    products : []
});

const Cart = mongoose.model("cart", cartsSchema);

module.exports = Cart;