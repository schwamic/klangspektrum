var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: String,
    access_token: String,
    refresh_token: String,
    name: String,
    stracks: [],
    ptracks: [],
    alltracks: [],
    image: [],
    playlists: [],
    ownPlaylist: []
});

mongoose.model('KlangUser', userSchema);