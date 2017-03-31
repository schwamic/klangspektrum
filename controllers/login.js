var querystring = require('querystring');
require('../models/user');
var mongoose = require('mongoose');

// Init
var KlangUser = mongoose.model('KlangUser');

exports.get = function (request, response) {
    var client_id = '...';
    var redirect_uri = 'http://www.klangspektrum.digital/api/callback';    // CALLBACK URI
    var stateKey = 'spotify_auth_state';
    var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read';
    var state = generateRandomString(16);

    // save user in db
    var current_user = new KlangUser({'user':request.params.user});
    current_user.save();

    response.cookie(stateKey, state);
    response.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
            show_dialog: true
        }));
};

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
