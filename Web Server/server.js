var express  = require("express"),
    app      = express(),
    http     = require("http"),
    server   = http.createServer(app),
    mongoose = require('mongoose'),
    html_dir = '../admin/';

global.io = require('socket.io')(server);

global.io.on('connection', function(socket) {
  console.log("a user connected");
});


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
}

app.configure(function () {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname, '/admin'));
});

app.get('/', function(req, res) {
  res.send("El servidor se esta ejecutando.");
});

app.options('/*', function(req, res){
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    res.send(200);
});

routes  = require('./routes')(app);

mongoose.connect('mongodb://localhost/robocode', function(err, res) {
  if(err) {
    console.log('ERROR: conectando a la base de datos. ' + err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

server.listen(8000,function() {
  console.log("Servidor Node ejecutandose en http://localhost:8000");

  var Engine = require('./models/engine.js');

  Engine.find(function(err, engines) {
      if(!err) {

        var headers = {
          'Content-Type': 'application/json',
          'Content-Length': 0
        };

        for(i = 0; i<engines.length; i++){

          var e = engines[i];

          var options = {
            host: e.ip,
            port: e.puerto,
            path: '/engine/echo',
            method: 'POST',
            headers: headers
          };

          var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);

            if(res.statusCode === 200) {
              res.on('data', function(data) {
                var resultObject = JSON.parse(data);
                console.log(resultObject);
                if(resultObject != null && resultObject.rc === '00'){
                  initArena(e._id, e.nombre);
                } else {
                  closeArena(e);
                }
              });
            } else {
              closeArena(e);
            }

          });

          req.on('error', function(er) {
            console.log('problem with request: ' + er.message);
            closeArena(e);
          });

          console.log('ECHO to: ' + e.ip);
          req.end();
        }
      } else {
        console.log('ERROR: ' + err);
      }
    });
});
