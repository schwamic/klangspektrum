const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (request, response) => {
    // show loading + request data
    response.sendFile(path.join(__dirname + '/../views/klangviz.html'));
});

module.exports = router;
