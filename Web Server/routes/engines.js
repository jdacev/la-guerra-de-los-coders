module.exports = function(app) {

  var Engine = require('../models/engine.js');
  var Arena = require('../models/arena.js');
  var Robot = require('../models/robot.js');
  var arenaClosed = "closed";
  var arenaInitialized = "initialized";
  var arenaStarted = "started";
  var arenaFighting = "fighting";
  var http = require("http");
  var fs = require('fs');

  findAllEngines = function(req, res) {
  	Engine.find(function(err, engines) {
  		if(!err) {
  			res.send(engines);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  findById = function(req, res) {
    console.log('Get engine: ' + req.params.id);
    Engine.findById(req.params.id, function(err, engine) {
      if(!err) {
        console.log(engine);
        res.send(engine);
      } else {
        console.log('ERROR: ' + err);
      }
    });
  };

  createEngine = function(nombre,ip,puerto){
    var engine = new Engine({nombre: nombre, ip: ip, puerto: puerto});
    console.log("create engine");
    console.log(engine);
    engine.save(function(err) {
      if(!err) {
        console.log('Created');
      } else {
        console.log('ERROR: ' + err);
      }
    });

    return engine;
  };

  addEngine = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var engine = createEngine(req.body.nombre,req.body.ip,req.body.puerto);

    res.send(engine);
  };

  updateEngine = function(req, res) {
    Engine.findById(req.params.id, function(err, engine) {
      engine.nombre   = req.body.nombre;
      engine.ip    = req.body.ip;
      engine.puerto    = req.body.puerto;

      engine.save(function(err) {
        if(!err) {
      console.log('Updated');
        } else {
      console.log('ERROR: ' + err);
        }

        res.send(engine);
      });
    });
  };

  deleteEngine = function(req, res) {
    Engine.findById(req.params.id, function(err, engine) {
      engine.remove(function(err) {
        if(!err) {
          res.send("deleted");
        } else {
      console.log('ERROR: ' + err);
        }
      })
    });
  };

  registerEngine = function(req,res){
    console.log('Register engine');
    console.log(req.body);
    Engine.findOne({'nombre': req.body.nombre,
                    'ip': req.body.ip,
                    'puerto': req.body.puerto} , function(err, engine) {
      if(!err) {
        var rc = "00";
        if(engine == null) {
          engine = createEngine(req.body.nombre,req.body.ip,req.body.puerto);
          rc = "01";
        }
        initArena(engine._id, engine.nombre);
        res.send(JSON.stringify(rc));
      } else {
        console.log('ERROR: ' + err);
      }

    });

  };

  stopEngine = function(req,res){
    console.log('Stop engine');
    console.log(req.body);
    Engine.findOne({'ip': req.body.ip,
                    'puerto': req.body.puerto} , function(err, engine) {
      if(!err) {
        if(engine != null) {
          closeArena(engine);
        }
        var rc = "00";
        res.send(JSON.stringify(rc));
      } else {
        console.log('ERROR: ' + err);
      }

    });

  };

  createArena = function(engineId,nombre){
    var arena = new Arena({name: nombre, engineId: engineId, status: arenaInitialized, robots: []});

    arena.save(function(err) {
      if(!err) {
        console.log('Arena created');
      } else {
        console.log('ERROR: ' + err);
      }
    });

    return arena;
  };

  initArena = function(engineId, nombre){
    console.log('Initialize Arena');
    Arena.findOne({'engineId': engineId} , function(err, arena) {
      if(!err) {
        if(arena == null) {
          var arena = createArena(engineId, nombre);
        }  else {
          arena.status = arenaInitialized;
          arena.robots = [];
          arena.engineId = engineId;
          arena.name = nombre;
          arena.save(function(err) {
            if(!err) {
              console.log('Arena initialized.');
            } else {
              console.log('Initializing arena error: ' + err);
            }

          });
        }
      } else {
        console.log('ERROR: ' + err);
      }

    });

  };

  closeArena = function(engine){
    console.log('Closing Arena: ' + engine.nombre);
    Arena.findOne({'engineId': engine._id} , function(err, arena) {
      if(!err) {
        if(arena != null) {
          arena.status = arenaClosed;
          arena.robots = [];
          arena.save(function(err) {
            if(!err) {
              console.log('Arena closed.');
              global.io.sockets.emit('arenaNew', arena);
            } else {
              console.log('Closing arena error: ' + err);
            }

          });
        }
      } else {
        console.log('ERROR: ' + err);
      }

    });
  };

  findAllArenas = function(req, res) {
    Arena.find(function(err, arenas) {
      if(!err) {
        res.send(arenas);
      } else {
        console.log('ERROR: ' + err);
      }
    });
  };

  deleteArena = function(req, res) {
    Arena.findById(req.params.id, function(err, arena) {
      arena.remove(function(err) {
        if(!err) {
          res.send("deleted");
        } else {
          console.log('ERROR: ' + err);
        }
      })
    });
  };

  addRobotToArena = function(req, res) {
    console.log('Add Robot To Arena');
    console.log(req.body);

    Arena.findById(req.body.arenaId, function(err, arena) {

      if(!err && arena != null) {
        var exist = false;
        for(i = 0; i<arena.robots.length; i++){
          if(arena.robots[i] === req.body.robotId){
            exist = true;
            break;
          }
        }
        if(!exist){
          if(arena.robots.length == 0){
            arena.status = arenaStarted
            setTimeout(function () {
              console.log('Arena fight!')

              Engine.findById(arena.engineId, function(err, engine) {
                if(!err && engine != null) {

                  Arena.findById(req.body.arenaId, function(err, arenaFinal) {


                    Robot.find({'_id': { $in: arenaFinal.robots}}, function(err, robots) {
                      if(!err) {

                        var jarName = arenaFinal.name.replace(" ", "_") + ".jar";
                        if (fs.existsSync("./files/" + jarName)) {
                          fs.unlinkSync("./files/" + jarName);
                        }
                        var robotList = [];
                        var robotArg = "";

                        for(i = 0; i<robots.length; i++){
                          var robot = robots[i];
                          var propFile = "./files/com/grupoassa/robocode/user" + robot.userId +"/"+ robot.name + ".properties";
                          if (fs.existsSync(propFile)) {
                            fs.unlinkSync(propFile);
                          }
                          fs.writeFileSync(propFile, "robot.description="+robot._id+"\n"+
                            "robot.webpage=\n"+
                            "robocode.version=1.1\n"+
                            "robot.java.source.included=false\n"+
                            "robot.author.name="+robot.userId+"\n"+
                            "robot.classname=com.grupoassa.robocode.user"+robot.userId+"."+robot.name+"\n"+
                            "robot.name="+robot.name);
                          /*var robotBattle = {};
                          robotBattle.name = robot.name;
                          robotBattle.file = robot.file;*/
                          robotList.push("com.grupoassa.robocode.user"+robot.userId+"."+robot.name);
                          robotArg += "com/grupoassa/robocode/user"+robot.userId+"/"+robot.name + '.class ';
                          robotArg += "com/grupoassa/robocode/user"+robot.userId+"/"+robot.name + '.properties ';
                        }

                        var exec = require('child_process').exec('package.bat ' + jarName + ' ' + robotArg,
                          function (error, stdout, stderr){
                            var response = {};
                            if(error !== null){
                              response.error = "Error empaquetando batalla: " + error;
                              console.log(response);
                            } else {
                              response = { "stdout" : stdout, "stderr": stderr};
                              var battleData = {};
                              battleData.jarName = jarName;
                              var jarFile = fs.readFileSync("./files/" + jarName);
                              battleData.jarFile = jarFile.toString('base64');
                              battleData.robots = robotList;

                              var battleString = JSON.stringify(battleData);
                              var headers = {
                                'Content-Type': 'application/json',
                                'Content-Length': battleString.length
                              };

                              var options = {
                                host: engine.ip,
                                port: engine.puerto,
                                path: '/engine/start',
                                method: 'POST',
                                headers: headers
                              };

                              var req = http.request(options, function(res) {
                                console.log('STATUS: ' + res.statusCode);

                                if(res.statusCode === 200) {

                                  res.on('data', function(data) {
                                    var resultObject = JSON.parse(data);
                                    console.log('Battle result:');
                                    console.log(resultObject);
                                    resultObject.arenaId = arenaFinal._id;
                                    global.io.sockets.emit('result', { result: resultObject});
                                  });
                                } else {
                                  var resultObject = {};
                                  resultObject.arenaId = arenaFinal._id;
                                  resultObject.error = res.statusCode;
                                  global.io.sockets.emit('result', { result: resultObject});
                                }
                                initArena(engine._id, engine.nombre);

                              });

                              req.on('error', function(e) {
                                console.log('problem with request: ' + e.message);
                                initArena(engine._id, engine.nombre);
                              });
                              
                              req.write(battleString);
                              req.end();

                              arenaFinal.status = arenaFighting;
                              arenaFinal.save(function(err) {
                                global.io.sockets.emit('arenaNew', arenaFinal);
                              });
                            }
                          }
                        );
                        
                      } else {
                        console.log('Se produjo un error obteniendo los robots para la batalla: ' + err);
                      }
                    });
                  });

                } else {
                  console.log('ERROR iniciando batalla: ' + err);
                }
              });
              

            }, 60000);
          }
          arena.robots.push(req.body.robotId);
          arena.save(function(err) {
            var response = {};
            if(!err) {
              console.log('Robot added to arena');
              global.io.sockets.emit('arenaNew', arena);
              response.rc = "00";
            } else {
              console.log('ERROR updating arena: ' + err);
              response.rc = "01";
              response.error = err;
            }
            res.send(response);
          });
        } else {
            var response = {};
            response.rc = "01";
            response.error = "Robot ya agregado a la arena";
            res.send(response);
        }
      } else {
        console.log('ERROR getting arena: ' + err);
        var response = {};
        response.rc = "01";
        response.error = err;
        res.send(response);
      }

    });

  };

  app.get('/engines', findAllEngines);
  app.get('/engine/:id', findById);
  app.post('/engine', addEngine);
  app.put('/engine/:id', updateEngine);
  app.delete('/engine/:id', deleteEngine);
  app.post('/engine/register', registerEngine);
  app.post('/engine/stop', stopEngine);
  app.get('/arenas', findAllArenas);
  app.delete('/arena/:id', deleteArena);
  app.post('/addRobotToArena', addRobotToArena);

}