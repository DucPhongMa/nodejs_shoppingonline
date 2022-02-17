const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    cart: {type: Object, require: true},
    address: {type: String, require: true},
    name: {type: String, require: true},
    paymentId: {type: String, require: true}

},{
    timestamps: true,
});

module.exports = mongoose.model('Order', Order, 'Orders');