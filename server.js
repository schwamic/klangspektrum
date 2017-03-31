'use-strict';

// Imports
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var webpack = require('webpack');
var config = require('./webpack.config');
var mongoose = require('mongoose');

// Init
var compiler = webpack(config);
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 4000;

// Middleware
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(cookieParser());
app.use(cors());

// Static folder
app.use(express.static('./public'));

// Routes
var index = require('./routes/index');
var klangviz = require('./routes/klangviz');
var api = require('./routes/api');
app.use('/', index);
app.use('/klangviz', klangviz);
app.use('/api', api);

// Error-Handling
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
app.use(function (req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Internal Error');
});

// Init database connection
mongoose.Promise = global.Promise;

// Build the connection string 
var dbURI = '...';
var user = '...';
var pwd = '...';

// Create the database connection 
mongoose.connect(`mongodb://${user}:${pwd}@${dbURI}`);

// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.log('uncaughtException: ' + err);
    process.exit(1);
});

// Server
server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    };
    console.log(`Server listening at port: ${port}`);
});
