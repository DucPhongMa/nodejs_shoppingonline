const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    Category_Name: { type: String, required: true, },
},{
    timestamps: true,
});

module.exports = mongoose.model('Category', Category, 'Categories');