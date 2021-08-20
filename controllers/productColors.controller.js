const ProductColor = require('../models/productColors.model.js');

// Create and Save a new Color
exports.create = (req, res) => {
    // Validate request
    if (!req.body.color || !req.body.hex) {
        return res.status(400).send({
            message: "You have got an empty fields"
        });
    }

    // Create a Color
    const color = new ProductColor({
        color: req.body.color,
        hex: req.body.hex
    });

    // Save Color in the database
    color.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Color."
            });
        });
};

// Retrieve and return all colors from the database.
exports.findAll = (req, res) => {
    ProductColor.find({ deleted: false })
        .select(['-deleted'])
        .then(colors => {
            res.send(colors);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving colors."
            });
        });
};

// Find a single color with a colorId
exports.findOne = (req, res) => {
    ProductColor.findById(req.params.colorId)
        .then(color => {
            if (!color) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.send(color);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.status(500).send({
                message: "Error retrieving color with id " + req.params.colorId
            });
        });
};

// Update a color identified by the colorId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.color || !req.body.hex) {
        return res.status(400).send({
            message: "You have got an empty fields"
        });
    }

    // Find color and update it with the request body
    ProductColor.findByIdAndUpdate(req.params.colorId, {
        color: req.body.color,
        hex: req.body.hex
    }, { new: true })
        .then(color => {
            if (!color) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.send(color);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.status(500).send({
                message: "Error updating color with id " + req.params.colorId
            });
        });
};

// Delete a color with the specified colorId in the request
exports.delete = (req, res) => {
    ProductColor.findByIdAndUpdate(req.params.colorId, {
        deleted: true
    })
        .then(color => {
            if (!color) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.send({ message: "Color deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.status(500).send({
                message: "Could not delete color with id " + req.params.colorId
            });
        });
};
