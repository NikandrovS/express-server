const mongoose = require('mongoose');

const ProductColorSchema = mongoose.Schema({
    color: String,
    hex: String,
    deleted: { type: Boolean, default: 'false' }
}, {
    versionKey: false
});

module.exports = mongoose.model('Color', ProductColorSchema);
