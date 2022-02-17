const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Product = new Schema({
    title: { type: String, required: true, unique: true },
    Image: { type: String, },
    description: { type: String },
    content: { type: String},
    price: {
        type: Number, required: true,
    },
    quantity: { type: Number, required: true,},
    Categories:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
},{
    timestamps: true,
});

module.exports = mongoose.model('Product', Product, 'Products');