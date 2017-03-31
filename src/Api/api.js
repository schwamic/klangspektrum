'use-strict';
import 'whatwg-fetch'; // Polyfill
var sortData = require('./sort').sortData;

function api(a, r, u, d) {
    var access_token = a;
    var refresh_token = r;
    var user = u;
    var domain = d;
    var p = document.getElementById('loaderfeed');
    var gn = document.getElementById('greez_name');
    var user_id;
    var user_abo;
    var user_image;
    var first_time = 'true';
    var offset = 0;
    var count = 0;
    var atracks = [];
    var plists = [];
    var pindex = 0;
    var pindex_list = [];
    var features_list = [];
    var artists_list = [];

    this.loadMe = function () {
        // console.log('Request to load me');
        p.innerHTML = `load me`;
        // FETCH - api/loadMe/:access_token/:user'
        let result = fetch(`http://${domain}/api/loadMe/${access_token}/${user}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            user_id = json.user_id;
            user_image = json.user_image;
            gn.innerHTML = `Hello <b>${user_id}</b>, this could take a little while.`;
            setTimeout(function () {
                gn.style.opacity = 1;
                $('#loadingBar').css('width', '15vw');
                loadSavedTracks();
            }, 200);
            // console.log(json);
        });
    };

    var loadSavedTracks = function () {
        // console.log('Request to load saved-tracks');
        p.innerHTML = `load saved-tracks`;
        // FETCH - api/loadSavedTracks/:access_token/:user/:offset/:count/:first_time/
        let result = fetch(`http://${domain}/api/loadSavedTracks/${access_token}/${user}/${offset}/${count}/${first_time}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            first_time = 'false';
            atracks = atracks.concat(json.mydata);
            if (json.count == json.offset) {
                offset = 0;
                count = 0;
                first_time = 'true';
                // console.log(`Finished loading stracks - ${atracks.length} songs`);
                $('#loadingBar').css('width', '30vw');
                loadPlaylists();
            } else {
                offset = json.offset;
                count = json.count;
                // console.log('offset:' + offset + ', count:' + count);
                loadSavedTracks();
            }
        });
    };

    var loadPlaylists = function () {
        // console.log('Request to load playlists ');
        p.innerHTML = `load playlists`;
        // FETCH - api/loadSavedTracks/:access_token/:user/:offset/:count/:first_time/:user_id
        let result = fetch(`http://${domain}/api/loadPlaylists/${access_token}/${user}/${offset}/${count}/${first_time}/${user_id}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            first_time = 'false';
            plists = plists.concat(json.mydata);
            if (json.count == json.offset) {
                offset = 0;
                count = 0;
                first_time = 'true';
                // console.log(`Finished loading plists - ${plists.length} playlists`);
                // Check playlists - added_by
                for (let i = 0; i < plists.length; i++) {
                    if (plists[i].id == user_id) {
                        pindex_list.push(i);
                    }
                }
                // console.log(pindex_list);
                $('#loadingBar').css('width', '45vw');
                loadPlaylistTracks();
            } else {
                offset = json.offset;
                count = json.count;
                // console.log('offset:' + offset + ', count:' + count)
                loadPlaylists();
            }
        });
    };

    var loadPlaylistTracks = function () {
        // console.log('Request to load playlist tracks ');
        p.innerHTML = `load playlist-tracks`;
        // FETCH - api/loadPlaylistTracks/:access_token/:user/:user_id/:pindex'
        let result = fetch(`http://${domain}/api/loadPlaylistTracks/${access_token}/${user}/${user_id}/${pindex_list[pindex]}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            pindex++;
            // check result
            let state = (json.mydata != undefined) ? ((json.mydata.length > 0) ? true : false) : false;
            if (state) {
                atracks = atracks.concat(json.mydata);
            }
            if (pindex_list[pindex] == undefined) {
                // console.log(`Finished loading ptracks - ${atracks.length} songs`);
                $('#loadingBar').css('width', '60vw');
                createAllTracks();
            } else {
                // console.log('pindex:' + pindex + ', pindex_list-length:' + pindex_list.length);
                loadPlaylistTracks();
            }
        });
    };

    var createAllTracks = function () {
        // console.log('Request to create all tracks');
        let result = fetch(`http://${domain}/api/loadAllTracks/${user}`);
        result.then(function () {
            loadFeatures();
            // console.log('Finished joining');
        });
    };

    var loadFeatures = function () {
        // console.log('Request to load all features');
        p.innerHTML = `load features`;
        let result = fetch(`http://${domain}/api/loadFeatures/${access_token}/${user}/${offset}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            features_list = features_list.concat(json.mydata);
            // console.log(json.offset);
            // console.log(json.error);
            if (json.count == json.offset) {
                // console.log('finished features - ' + features_list.length);
                offset = 0;
                count = 0;
                p.innerHTML = `load artists`;
                $('#loadingBar').css('width', '75vw');
                loadArtists();
            } else {
                offset = json.offset;
                count = json.count;
                // console.log('offset:' + offset + ', count:' + count)
                loadFeatures();
            }
        });
    };

    var loadArtists = function () {
        // console.log('Request to load all artists');
        let result = fetch(`http://${domain}/api/loadArtists/${access_token}/${user}/${offset}`);
        result.then(function (res) {
            return res.json();
        }).then(function (json) {
            artists_list = artists_list.concat(json.mydata);
            // console.log(json.error);
            if (json.count == json.offset) {
                // console.log('finished artists - ' + artists_list.length);
                offset = 0;
                count = 0;
                p.innerHTML = `sort data`;
                $('#loadingBar').css('width', '90vw');
                setTimeout(function () {
                    sortData(atracks, features_list, artists_list);
                }, 500);
            } else {
                offset = json.offset;
                count = json.count;
                // console.log('offset:' + offset + ', count:' + count)
                loadArtists();
            }
        });
    };

    document.getElementById('logout').addEventListener('click', function (event) {
        // console.log('logout');
        event.preventDefault();
        access_token = null;
        refresh_token = null;
        user = null;
        localStorage.clear();
        window.location.href = `http://${domain}/api/logout`;
    });
};

export { api as default };
