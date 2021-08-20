const path = require('path');
const fs = require('fs');

const ProductItem = require('../models/productItem.model.js');
const ProductUtils = require('../utils/productItem.utils');

exports.create = async (req, res) => {
    try {
        async function checkTitles() {
            const result = await ProductItem.findOne({ code: req.body.code });
            if (!result) {
                return true;
            }
            return undefined;
        }

        const check = await checkTitles();

        if (req.body.title && !check) {
            await ProductUtils.removeTitleValue(req.body.code);
        }

        const item = new ProductItem({
            code: req.body.code,
            name: req.body.name,
            color: req.body.color,
            sizes: req.body.sizes || [],
            price: req.body.price,
            title: req.body.title || check,
            images: req.body.images
        });

        const result = await item.save();

        res.send(result);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the item."
        });
    }
};

exports.findAll = (req, res) => {
    ProductItem.find()
        .then(async items => {
            const result = await ProductUtils.appendColors(items);
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

exports.findTitles = (req, res) => {
    ProductItem.find({ title: true })
        .then(items => {
            res.send(items);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

exports.findOne = (req, res) => {
    ProductItem.findById(req.params.itemId)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemId
                });
            }
            res.send(item);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemId
                });
            }
            res.status(500).send({
                message: "Error retrieving item with id " + req.params.itemId
            });
        });
};

exports.update = async (req, res) => {
    let updatedItem = {};
    const exceptions = ['title', 'images'];

    if (req.body.title) {
        await ProductUtils.removeTitleValue(req.body.code);
        updatedItem.title = true;
    }

    for (const [key, value] of Object.entries(req.body)) {
        if (exceptions.includes(key)) continue;
        updatedItem[key] = value;
    }

    ProductItem.findByIdAndUpdate(req.params.itemId, updatedItem, { new: true })
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.itemId
                });
            }
            res.send(item);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.itemId
                });
            }
            res.status(500).send({
                message: "Error updating color with id " + req.params.itemId
            });
        });
};

exports.delete = (req, res) => {
    ProductItem.findByIdAndUpdate(req.params.itemId, {
        deleted: true
    })
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemId
                });
            }
            res.send({ message: "Item deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemId
                });
            }
            res.status(500).send({
                message: "Item not delete color with id " + req.params.itemId
            });
        });
};

exports.uploadImage = (req, res) => {
    const fileData = req.file;

    if (!fileData) {
        res.status(400).send("Ошибка при загрузке файла");
        return;
    }
    res.status(200).send(fileData.filename);
};

exports.deleteImage = (req, res) => {
    const filePath = path.join(__dirname, `../uploads/products/${ req.query.filename }`);

    fs.unlink(filePath, function (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).send("ok");
    });
};
