module.exports = function(app) {

  var User = require('../models/user.js');
  var Robot = require('../models/robot.js');
  var fs = require('fs');
  var robotOk = "ok";
  var robotFail = "fail";

  findAllUsers = function(req, res) {
  	User.find(function(err, users) {
  		if(!err) {
  			res.send(users);
  		} else {
  			console.log('Se produjo un error: ' + err);
  		}
  	});
  };

  findById = function(req, res) {
    console.log('GetUser: ' + req.params.id)
    User.findById(req.params.id, function(err, user) {
      if(!err) {
        res.send(user);
      } else {
        console.log('Se produjo un error: ' + err);
      }
    });
  };

  addUser = function(req, res) {
    console.log('POST');
    console.log("body " + req.body);

    user = createUser(req.body);

    res.send(user);
  };

  createUser = function(data) {
    console.log("Create User");
    console.log(data);

    var user = new User({
        nombre: data.nombre,
        email:  data.email
      });

      user.save(function(err) {
        if(!err) {
          console.log('El usuario se creo con exito');
        } else {
          console.log('Se produjo un error: ' + err);
        }
      });

      return user;
  };

  updateUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      user.nombre   = req.body.nombre;
      user.apellido    = req.body.apellido;

      user.save(function(err) {
        if(!err) {
      console.log('El usuario se actualizo con exito.');
        } else {
      console.log('Se produjo un error: ' + err);
        }

        res.send(user);
      });
    });
  };

  deleteUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      user.remove(function(err) {
        if(!err) {
          console.log('El usuario se elimino con exito.');
        } else {
          console.log('Se produjo un error: ' + err);
        }
      })
    });
  };

  login = function(req, res) {
    
    console.log('LOGIN');
    console.log(req.body);

    User.findOne({'email': req.body.email} , function(err, user) {
 
      if(!err) {
        if (user == null) {
          user = createUser(req.body);
        } 

        res.send(user);

      } else {
        console.log('Se produjo un error: ' + err);
        res.send({'error' : err});
      }

    });

  };

  findRobotById = function(req, res) {
    console.log('GetRobot: ' + req.params.id)
    Robot.findById(req.params.id, function(err, robot) {
      if(!err) {
        res.send(robot);
      } else {
        console.log('Se produjo un error: ' + err);
      }
    });
  };

  deleteRobot = function(req, res) {
    Robot.findById(req.params.id, function(err, robot) {
      var response = {};
      if(!err) {
        if(robot != null){
          robot.remove(function(err) {
            if(!err) {
              console.log('El robot ' + robot.name +' se elimino con exito.');
              response.rc = '00';
            } else {
              console.log('Se produjo un error: ' + err);
              response.error = err;
            }
            res.send(response);
          })
        } else {
          console.log('El robot no existe');
          response.error = 'El robot no existe';
          res.send(response);
        }
      } else {
        console.log('Se produjo un error eliminando el robot: ' + err);
        response.error = err;
        res.send(response);
      }
    });
  };

  setRobot = function(req, res) {
    
    console.log('SetRobot');

    var response = {};

    if(req.body.userId == null){
      response.error = "Usuario no enviado";
      res.send(response);
    } else {

      User.findById(req.body.userId, function(err, user) {
        var response  = {};
        if(!err) {

            var robot = new Robot({
              name: req.body.name,
              file:  req.body.file,
              fileName: req.body.fileName,
              userId: req.body.userId,
              status: robotFail
            });

            robot.save(function(err) {
              if(!err) {
                console.log('El robot se creo con exito');
                var path = 'files/com/grupoassa/robocode/user'+ req.body.userId
                if (!fs.existsSync(path)){
                  fs.mkdirSync(path);
                }
                fs.writeFileSync(path + "/" +req.body.fileName, req.body.file);

                var exec = require('child_process').exec('compiler.bat ' + req.body.userId + " " + req.body.fileName,
                  function (error, stdout, stderr){
                    var response = {};
                    if(error !== null){
                      response.error = "Error compilando robot: " + error;
                    } else {
                      response = { "stdout" : stdout, "stderr": stderr};
                      robot.status = robotOk;
                      robot.save(function(err){});
                    }
                    res.send(response);
                  }
                );
              } else {
                response.error = 'Error creando el robot: ' + err;
                res.send(response);
              }
            });


        } else {
          console.log("Usuario no encontrado");
          response.error = "Usuario no encontrado";
          res.send(response);
        }
      });
    }

  };

  getRobots = function(req, res) {

    console.log('GetRobots');

    Robot.find({'userId': req.params.id}, function(err, robots) {
      if(!err) {
        res.send(robots);
      } else {
        console.log('Se produjo un error: ' + err);
      }
    });

  };

  updateRobot = function(req, res) {
    console.log('updateRobot');
    if (req.body.id != null || req.body.file != null){
      Robot.findById(req.body.id, function(err, robot) {
        robot.file   = req.body.file;
        robot.status = robotFail;

        robot.save(function(err) {
          if(!err) {
            fs.writeFileSync('files/com/grupoassa/robocode/user'+ robot.userId + "/" + robot.fileName, robot.file);

            var exec = require('child_process').exec('compiler.bat ' + robot.userId + " " + robot.fileName,
              function (error, stdout, stderr){
                var response = {};
                if(error !== null){
                  response.error = "Error compilando robot: " + error;
                } else {
                  response = { "stdout" : stdout, "stderr": stderr};
                  robot.status = robotOk;
                  robot.save(function(err){});
                }
                res.send(response);
              }
            );
            console.log('El robot se actualizo con exito.');
          } else {
            console.log('Se produjo un error actualizando el robot: ' + err);
            var response = {};
            response.error = "Datos no enviados";
            res.send(response);
          }
        });
      });
    } else {
      var response = {};
      response.error = "Datos no enviados";
      res.send(response);
    }
  };

  app.get('/users', findAllUsers);
  app.get('/user/:id', findById);
  app.post('/user', addUser);
  app.put('/user/:id', updateUser);
  app.delete('/user/:id', deleteUser);
  app.post('/setRobot', setRobot);
  app.post('/updateRobot', updateRobot);
  app.post('/login', login);
  app.get('/user/:id/robots', getRobots);
  app.get('/robot/:id', findRobotById);
  app.delete('/robot/:id', deleteRobot);

}