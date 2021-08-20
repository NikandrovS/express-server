module.exports = (app) => {
    const colors = require('../controllers/productColors.controller.js');

    // Create a new color
    app.post('/productColors', colors.create);

    // Retrieve all colors
    app.get('/productColors', colors.findAll);

    // Retrieve a single color with colorId
    app.get('/productColors/:colorId', colors.findOne);

    // Update a color with colorId
    app.put('/productColors/:colorId', colors.update);

    // Delete a color with colorId
    app.delete('/productColors/:colorId', colors.delete);
};
