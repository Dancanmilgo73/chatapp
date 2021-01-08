var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ appId: "1133513", key: "28637b4f7b1081ab57bc", secret:  "c8eb2404af10a0b4e3ed", cluster: "mt1" });

app.post('/pusher/auth', function(req, res) {
    var socketId = req.body.socket_id;
    var channel = req.body.channel_name;
    var auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

app.post('/message', function(req, res) {
    var message = req.body.message;
    var name = req.body.name;
    pusher.trigger( 'private-chat', 'message-added', { message, name });
    res.sendStatus(200);
});

app.get('/',function(req,res){
        res.sendFile('/public/index.html', {root: __dirname });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`app listening on port ${port}!`)
});