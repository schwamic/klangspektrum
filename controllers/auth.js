var querystring = require('querystring');
var new_request = require('request');

exports.get = function (request, response) {
    var client_id = '...';
    var client_secret = '...';   
    var redirect_uri = 'http://www.klangspektrum.digital/api/callback'; // REDIRECT URI
    var stateKey = 'spotify_auth_state';
    var code = request.query.code || null;
    var state = request.query.state || null;
    var storedState = request.cookies ? request.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
        response.redirect('/klangviz/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = getAuthOptionsCallback(code, redirect_uri, client_id, client_secret);
        new_request.post(authOptions, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                var access_token = body.access_token;
                var refresh_token = body.refresh_token;

                // send tokens to client
                response.redirect('/klangviz?' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                response.redirect('/klangviz/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
};

var getAuthOptionsCallback = function (code, redirect_uri, client_id, client_secret) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };
    return authOptions;
};
