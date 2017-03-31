'use-strict';
var startViz = require('./start').startViz;

function sortData(atracks, features_list, artists_list) {
    var i;
    var songDateFeatureValueMap = {};
    var sortedSongs = {};

    for (var i = 0; i < atracks.length; i++) {
        // Check === undefined -> undefined and == undefined -> null
        if (!(atracks[i] == undefined || features_list[i] == undefined || artists_list[i] == undefined)) {
            var l_song = {
                added_at: atracks[i].added_at,
                artist: artists_list[i].name,
                title: atracks[i].track.name,
                preview_url: atracks[i].track.preview_url,
                genre: (artists_list[i].genres == undefined) ? [] : artists_list[i].genres,
                features: {
                    'acousticness': features_list[i].acousticness,
                    'danceability': features_list[i].danceability,
                    'energy': features_list[i].energy,
                    'instrumentalness': features_list[i].instrumentalness,
                    'liveness': features_list[i].liveness,
                    'speechiness': features_list[i].speechiness,
                    'mood': features_list[i].valence,
                }
            };
            var l_song_id = l_song.id || i,
                l_features = l_song.features,
                l_date = new Date(l_song.added_at),
                l_month = l_date.getFullYear() + '-' + (((l_date.getMonth() + 1) < 10) ? ('0' + (l_date.getMonth() + 1)) : (l_date.getMonth() + 1)),
                l_entry = sortedSongs[l_month];

            l_song.id = l_song_id;

            songDateFeatureValueMap[l_song_id] = [];

            if (l_entry == null)
                l_entry = sortedSongs[l_month] = {};

            for (var l_feature in l_features) {
                // if (l_features.hasOwnProperty(l_feature))
                var l_value = '' + Math.ceil(l_features[l_feature] * 100) / 100;

                var l_entry_feature = l_entry[l_feature];
                if (l_entry_feature == null)
                    l_entry_feature = l_entry[l_feature] = {};

                var l_entry_value = l_entry_feature[l_value];
                if (l_entry_value == null)
                    l_entry_value = l_entry_feature[l_value] = {
                        songs: {},
                        friends: [],
                        valueID: -1
                    };

                l_entry_value.songs[l_song_id] = l_song;

                var l_song_dfv = songDateFeatureValueMap[l_song_id];
                if (l_song_dfv == null)
                    l_song_dfv = songDateFeatureValueMap[l_song_id] = [];

                l_song_dfv.push({
                    month: l_month,
                    feature: l_feature,
                    value: l_value,
                    songID: l_song_id,
                    valueID: -1
                });
            }
        };
    };
    // set valueID
    for (let m in sortedSongs) {
        var month = sortedSongs[m];
        let counter = 0;
        for (let f in month) {
            var feature = sortedSongs[m][f];
            for (let v in feature) {
                var value = sortedSongs[m][f][v];
                value.valueID = counter++;
            }
        }
    }

    // create friends
    for (let k in songDateFeatureValueMap) {
        // if (songDateFeatureValueMap.hasOwnProperty(k))
        var l_songs_dfv = songDateFeatureValueMap[k];
        for (let i = 0, n = l_songs_dfv.length; i < n; i++) {
            l_song_dfv = l_songs_dfv[i];
            l_song_dfv.valueID = sortedSongs[l_song_dfv.month][l_song_dfv.feature][l_song_dfv.value].valueID;
            for (let ele in l_songs_dfv) {
                sortedSongs[l_song_dfv.month][l_song_dfv.feature][l_song_dfv.value].friends.push(l_songs_dfv[ele]);
            }
        }
    }
    $('#loadingBar').css('width', '100vw');
    allKlangobj = sortedSongs;
    startViz();
};

module.exports = { sortData: sortData };
