var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    compressor = require('node-minify');

//app.get('/game.js', function(req, res) {
    //new compressor.minify({
        //language: 'ECMASCRIPT5',
        //type: 'uglifyjs',
        //fileIn: __dirname + '/code/**/*.js',
        //fileOut: __dirname + '/site/game.js',
        //callback: function(err, min) {
            //if (err) {
                //console.log(err);
                //res.send(500);
            //} else {
                //res.set('Content-Type', 'text/javascript');
                //res.send(min);
            //}
        //}
    //})
//});

app.use(express.static(__dirname + '/site', { maxAge: 0 }));

server.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0');
