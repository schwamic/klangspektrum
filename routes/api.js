const express = require('express');
const router = express.Router();
const path = require('path');

var login = require('../controllers/login');
var auth = require('../controllers/auth');
var load = require('../controllers/load');

router.get('/login/:user', login.get);
router.get('/callback', auth.get);
router.get('/loadMe/:access_token/:user', load.getMe);
router.get('/loadSavedTracks/:access_token/:user/:offset/:count/:first_time', load.getSavedTracks);
router.get('/loadPlaylists/:access_token/:user/:offset/:count/:first_time/:user_id', load.getPlaylists);
router.get('/loadPlaylistTracks/:access_token/:user/:user_id/:pindex', load.getPlaylistTracks);
router.get('/loadAllTracks/:user', load.createAllTracks);
router.get('/loadFeatures/:access_token/:user/:offset', load.getFeatures);
router.get('/loadArtists/:access_token/:user/:offset', load.getArtists);

router.get('/sortData', (request, response) => {
    // sort data and send to client -> callfunction with client_id!!
    var data = { 'data': 200 };
    setTimeout(function () {
        response.json(data);
    }, 10000);
});

router.get('/startApp', (request, response) => {
    // call client function
    setTimeout(function () {
        response.json(data);
    }, 10000);
});

router.get('/logout', (request, response) => {
    // Auth. delete and redirect
    response.redirect('/');
});

router.get('/download', (request, response) => {
    var file = __dirname + '/../download_folder/bachelorthesis-klangspektrum.pdf';
    response.download(file); // Set disposition and send it.
});

module.exports = router;
