'use strict';
var guard = require('when/guard');
var request_promise = require('request-promise');
require('../models/user');
var mongoose = require('mongoose');

// Init
var KlangUser = mongoose.model('KlangUser');
var guardedRequest = guard(guard.n(1), request_promise);


exports.getMe = function (request, response) {
    console.log('Start requestMe');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let user_id, user_image;
    let options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    request_promise(options)
        .then(function (result) {
            user_id = result.id;
            user_image = result.images;

            // add to db
            KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                if (err) throw err;
                myuser.name = user_id;
                myuser.image = user_image;
                myuser.save();
                let message = { 'user_id': user_id, 'user_image': user_image };
                response.json(message);
            });
        })
        .catch(function (err) {
            response.json({ 'error': 'getMe' });
        });
};


exports.getSavedTracks = function (request, response) {
    console.log('Start requestSavedTracks');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let offset = parseInt(request.params.offset);
    let count = parseInt(request.params.count);
    let first_time = request.params.first_time;
    var track_list = [];

    if (first_time == 'true') {
        let options = {
            url: `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request_promise(options)
            .then(function (result) {
                if (result.total > 0) {
                    // RESULT
                    // db + res
                    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                        if (err) throw err;
                        let limit = 50;
                        count = Math.ceil(result.total / limit);
                        offset++;
                        for (let item of result.items) {
                            let trackID = item.track.id;
                            let artistID = item.track.artists[0].id;
                            let tupel = { 'trackID': trackID, 'artistID': artistID };
                            myuser.stracks.push(tupel);
                            track_list.push(item);
                        };
                        myuser.save(function () {
                            response.json({ 'count': count, 'offset': offset, 'mydata': track_list });
                        });
                    });

                } else {
                    // No stracks available
                    response.json({ 'count': count, 'offset': offset, 'mydata': track_list });
                }
            })
            .catch(function (err) {
                response.json({ 'error': 'getSavedTracks' });
            });
    } else {
        let arr = [];
        let step = ((offset + 10) - count) < 0 ? (offset + 10) : count;
        for (let i = offset; i < step; i++) {
            arr.push(i * 50);
        };
        offset = step;

        Promise.all(arr.map(element => {
            let options = {
                url: `https://api.spotify.com/v1/me/tracks?limit=50&offset=${element}`,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            return guardedRequest(options);
        }))
            .then(result => {
                // RESULT
                // db + res
                KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        for (let item of result[i].items) {
                            let trackID = item.track.id;
                            let artistID = item.track.artists[0].id;
                            let tupel = { 'trackID': trackID, 'artistID': artistID };
                            myuser.stracks.push(tupel);
                            track_list.push(item);
                        }
                    };
                    myuser.save(function () {
                        response.json({ 'count': count, 'offset': offset, 'mydata': track_list });
                    });
                });
            })
            .catch(err => {
                response.json({ 'error': 'requestAllSavedTracks' });
            });
    }
};


exports.getPlaylists = function (request, response) {
    console.log('Start requestPlaylist');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let offset = parseInt(request.params.offset);
    let count = parseInt(request.params.count);
    let first_time = request.params.first_time;
    let user_id = request.params.user_id;
    let playlist_list = [];

    if (first_time == 'true') {
        let options = {
            url: `https://api.spotify.com/v1/users/${user_id}/playlists?limit=50&offset=${offset}`,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request_promise(options)
            .then(function (result) {
                // RESULT
                if (result.total > 0) {
                    // db + res
                    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                        if (err) throw err;

                        var limit = 50;
                        count = Math.ceil(result.total / limit);
                        offset++;
                        for (let item of result.items) {
                            let href = item.href;
                            let total = item.tracks.total;
                            let id = item.owner.id;
                            let tupel = { 'href': href, 'total': total, 'id': id };
                            playlist_list.push(tupel);
                            myuser.playlists.push(tupel);
                        };
                        myuser.save(function () {
                            response.json({ 'count': count, 'offset': offset, 'mydata': playlist_list });
                        });
                    });
                    // No playlists available
                } else {
                    response.json({ 'count': count, 'offset': offset, 'mydata': playlist_list });
                }
            })
            .catch(function (err) {
                response.json({ 'error': 'requestPlaylists' });
            });
    } else {
        let arr = [];
        let step = ((offset + 10) - count) < 0 ? (offset + 10) : count;
        for (let i = offset; i < step; i++) {
            arr.push(i * 50);
        };
        offset = step;

        Promise.all(arr.map(element => {
            let options = {
                url: `https://api.spotify.com/v1/users/${user_id}/playlists?limit=50&offset=${element}`,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            return guardedRequest(options);
        }))
            .then(result => {
                // DO STUFF WITH RESULT
                for (var i = 0; i < result.length; i++) {
                    for (let item of result[i].items) {
                        let href = item.href;
                        let total = item.tracks.total;
                        let tupel = { 'href': href, 'total': total };
                        playlist_list.push(tupel);
                    }
                };

                // add to db
                KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                    if (err) throw err;
                    let arr = myuser.playlists;
                    myuser.playlists = arr.concat(playlist_list);
                    myuser.save();
                    response.json({ 'count': count, 'offset': offset, 'mydata': playlist_list });
                });
            })
            .catch(err => {
                response.json({ 'error': 'requestPlaylists' });
            });
    }
};


exports.getPlaylistTracks = function (request, response) {
    console.log('Start requestPlaylistTracks');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let pindex = parseInt(request.params.pindex);
    let tasks = [];
    let playlisttracks_list = [];
    let limit = 100;
    let playlist;

    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
        if (err) throw err;
        playlist = myuser.playlists[pindex];
        let href = playlist.href;
        let total = playlist.total;

        for (let offset = 0; offset < total; offset += limit) {
            let options = {
                url: `${href}?limit=100&offset=${offset}`,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            tasks.push(options);
        };

        Promise.all(tasks.map(options => {
            return guardedRequest(options);
        }))
            .then(result => {
                // RESULT
                // db + res
                KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
                    if (err) throw err;

                    for (let i = 0; i < result.length; i++) {
                        for (let item of result[i].tracks.items) {
                            let trackID = item.track.id;
                            let artistID = item.track.artists[0].id;
                            let tupel = { 'trackID': trackID, 'artistID': artistID };
                            playlisttracks_list.push(item);
                            myuser.ptracks.push(tupel);
                        }
                    };
                    myuser.ownPlaylist.push(pindex);
                    myuser.save(function () {
                        response.json({ 'mydata': playlisttracks_list });
                    });
                });
            })
            .catch(err => {
                response.json({ 'error': 'requestPlaylistTracks' });
            });
    });
};


exports.createAllTracks = function (request, response) {
    let user = request.params.user;
    let stracks, ptracks, alltracks;
    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
        if (err) throw err;
        stracks = myuser.stracks;
        ptracks = myuser.ptracks;
        alltracks = stracks.concat(ptracks);
        myuser.alltracks = alltracks;
        myuser.save(function (err) {
            if (err) {
                response.json({ 'message': 'error' });
                console.log(err);
            }
            else {
                response.json({ 'message': 'OK' });
            }
        });
    });
};


exports.getFeatures = function (request, response) {
    console.log('Start getFeatures');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let offset = parseInt(request.params.offset);
    let tasks = [];
    let features_list = [];
    let limit = 50;
    let url = 'https://api.spotify.com/v1/audio-features?ids=';
    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
        if (err) throw err;
        let alltracks_list = myuser.alltracks;
        let count = alltracks_list.length;
        let step = ((offset + 500) - count) < 0 ? (offset + 500) : count;
        for (var i = offset; i < step; i++) {
            if (((i + 1) % limit) == 0 || ((step - i) == 1)) {
                url += '' + alltracks_list[i].trackID;

                var options = {
                    url: url,
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                url = 'https://api.spotify.com/v1/audio-features?ids=';
                tasks.push(options);
            } else {
                url += '' + alltracks_list[i].trackID + ',';
            };
        };
        offset = step;
        Promise.all(tasks.map(options => {
            return guardedRequest(options);
        }))
            .then(result => {
                for (let items of result) {
                    for (let child of items.audio_features) {
                        features_list.push(child);
                    }
                };
                // res
                response.json({ 'count': count, 'offset': offset, 'mydata': features_list });
            })
            .catch(err => {
                console.log(err);
                response.json({ 'error': 'requestFeatures' });
            });
    });
}

//CHANGE
exports.getArtists = function (request, response) {
    console.log('Start getArtists');
    let access_token = request.params.access_token;
    let user = request.params.user;
    let offset = parseInt(request.params.offset);
    let tasks = [];
    let artist_list = [];
    let limit = 50;
    let url = 'https://api.spotify.com/v1/artists?ids=';
    KlangUser.findOne({ user: `${user}` }, function (err, myuser) {
        if (err) throw err;
        let alltracks_list = myuser.alltracks;
        let count = alltracks_list.length;
        let step = ((offset + 500) - count) < 0 ? (offset + 500) : count;
        for (var i = offset; i < step; i++) {
            if (((i + 1) % limit) == 0 || ((step - i) == 1)) {
                url += '' + alltracks_list[i].artistID;

                var options = {
                    url: url,
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                url = 'https://api.spotify.com/v1/artists?ids=';
                tasks.push(options);
            } else {
                url += '' + alltracks_list[i].artistID + ',';
            };
        };
        offset = step;
        Promise.all(tasks.map(options => {
            return guardedRequest(options);
        }))
            .then(result => {
                for (let items of result) {
                    for (let child of items.artists) {
                        artist_list.push({ name: (child == null ? 'Unknown' : child.name),'genres': (child == null ? [] : child.genres) });
                    }
                };
                //add to db + res
                response.json({ 'count': count, 'offset': offset, 'mydata': artist_list });
            })
            .catch(err => {
                console.log(err);
                response.json({ 'error': 'requestArtists' });
            });
    });
};
