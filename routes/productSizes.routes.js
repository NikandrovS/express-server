module.exports = (app) => {
    const sizes = require('../controllers/productSizes.controller');

    app.post('/productSizes', sizes.create);

    app.get('/productSizes', sizes.findAll);

    app.delete('/productSizes/:sizeId', sizes.delete);
}
