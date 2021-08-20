const mongoose = require('mongoose');

const ProductItemSchema = mongoose.Schema({
    code: String,
    name: String,
    color: "objectId",
    sizes: Array,
    price: Number,
    title: Boolean,
    images: Array,
    deleted: { type: Boolean, default: 'false' }
}, {
    versionKey: false
});

module.exports = mongoose.model('Item', ProductItemSchema);
