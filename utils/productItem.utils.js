const ProductItem = require('../models/productItem.model.js');
const ProductColors = require('../models/productColors.model');

module.exports = {
    removeTitleValue,
    appendColors
};

async function removeTitleValue(code) {
    try {
        await ProductItem.updateOne({ code: code, title: true }, { $unset: { title: 1 } });
    } catch (e) {
        console.log(e);
    }
}

async function appendColors(items) {
    try {
        const colors = await ProductColors.find();
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < colors.length; j++) {
                if (items[i]._doc.color.toString() === colors[j]._doc._id.toString()) {
                    items[i]._doc.color = colors[j]._doc.color;
                }
            }
        }
        return items;
    } catch (e) {
        console.log(e);
    }
}
