const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.get('/imprint', (request, response) => {
    response.sendFile(path.join(__dirname + '/../views/imprint.html'));
});

module.exports = router;
