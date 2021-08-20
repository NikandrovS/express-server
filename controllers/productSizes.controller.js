const ProductSize = require('../models/productSizes.model.js');

exports.create = (req, res) => {
    if (!req.body.size) {
        return res.status(400).send({
            message: "Size field can not be empty"
        });
    }

    const size = new ProductSize({
        size: req.body.size
    });

    size.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the size."
            });
        });
};

exports.findAll = (req, res) => {
    ProductSize.find({ deleted: false })
        .select(['-deleted'])
        .then(sizes => {
            res.send(sizes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving sizes."
            });
        });
};

exports.delete = (req, res) => {
    ProductSize.findByIdAndUpdate(req.params.sizeId, {
        deleted: true
    })
        .then(size => {
            if (!size) {
                return res.status(404).send({
                    message: "Size not found with id " + req.params.sizeId
                });
            }
            res.send({ message: "Size deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Size not found with id " + req.params.sizeId
                });
            }
            res.status(500).send({
                message: "Size not delete color with id " + req.params.sizeId
            });
        });
};
