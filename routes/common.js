const express = require('express');
const router = express.Router();

require('../routes/productColors.routes.js')(router);
require('../routes/productSizes.routes.js')(router);
require('../routes/productItem.routes.js')(router);

router
    .get('/', function (req, res) {
        res.send('Home page');
    });

module.exports = router;
