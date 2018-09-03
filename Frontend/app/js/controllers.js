'use strict';

//var SERVER_URL = "http://172.16.17.104:8000";
var SERVER_URL = "http://localhost:8000";

/**************** Controllers *****************/
var tecnoRobocode = angular.module('tecnopolis-robocode.controllers', []);

/*** Intro Controller ***/
tecnoRobocode.controller('IntroCtrl', ['$scope', '$location', 'UserSessionFactory', function ($scope, $location, UserSessionFactory) {
      
      $scope.clearCurrentUser();

      $scope.playGuerraDeLosCoders = function() {
          $location.path('/login');
      };

}]);


/*** Login Controller ***/
tecnoRobocode.controller('LoginCtrl', ['$scope', '$http', '$location', 'UserSessionFactory', '$sce', function($scope, $http, $location, UserSessionFactory, $sce) {
    
    $scope.loginRobocode = function () {
      $http.post(SERVER_URL+'/login', $scope.user)
        
        .success(function(data, status, headers, config) {
            // this callback will be called asynchronously when the response is available
            if(data.error != null){
              $scope.openTempMessage('Error: ' + data.error, true, null, null);
            }else{
              UserSessionFactory.setUser(data);
              $scope.setCurrentUser();
              $location.path('/crearbot');
            }
        })

        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
            if(data.error != null){
              $scope.openTempMessage('Error: ' + data.error, true, null, null);
            }else{
              //Se produjo un error de comunicacion al server.
              //net::ERR_CONNECTION_REFUSED
              $scope.openTempMessage('Se perdi&oacute; la conexi&oacute;n con el servidor!', true, null, null);
            }
      });
    }
}]);




/*** MainMenu Controller ***/
tecnoRobocode.controller('MainMenuCtrl', ['$scope','$window', '$location', 'UserSessionFactory', '$modal', '$log',
  function ($scope, $window, $location, UserSessionFactory, $modal, $log) {
      
      $scope.setCurrentUser = function() {
          $scope.currentUser = UserSessionFactory.getUser();
      };

      $scope.clearCurrentUser = function() {
          $scope.currentUser = null;
      };

      $scope.salirRobocode = function () {
          $scope.openTempMessage("¿Queres salir de la guerra de los coders?" , true, true, null, 'MainMenuCtrl');
      };

      var modalInstance = null;
      $scope.closeTempMessage = function(){
        modalInstance.dismiss();
      }

      $scope.openTempMessage = function (message, showOkButton, showCancelButton, showSpinner, deDondeVengo) {
          
          modalInstance = $modal.open({
          templateUrl: 'popup-temporal.html',
          controller: GenericPopupModalInstanceCtrl,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            message: function () {
              return message;
            },
            showOkButton: function () {
              return showOkButton;
            },
            showCancelButton: function (){
              return showCancelButton;
            },
            showSpinner: function () {
              return showSpinner;
            },
            deDondeVengo: function () {
              return deDondeVengo;
            }
          }
        });
      };
}]);



/*** Bienvenido Controller ***/
tecnoRobocode.controller('BienvenidoCtrl', ['$scope', '$location', '$window', 'UserSessionFactory', 
  function ($scope, $location, $window, UserSessionFactory) {
      
      $scope.currentUser = UserSessionFactory.getUser();
      $scope.setCurrentUser();

}]);



/*** CrearBots Controller ***/
tecnoRobocode.controller('CrearBotsCtrl', ['$scope', '$http', 'UserSessionFactory', '$sce', '$modal', '$log', 
  function ($scope, $http, UserSessionFactory, $sce, $modal, $log) {

      $scope.currentUser = UserSessionFactory.getUser();
      $scope.setCurrentUser();

      $scope.colores = [
          {id:'Color.red', nombre:'Rojo'}, {id:'Color.green', nombre:'Verde'},
          {id:'Color.blue', nombre:'Azul'}, {id:'Color.white', nombre:'Blanco'},
          {id:'Color.black', nombre:'Negro'}, {id:'Color.yellow', nombre:'Amarillo'},
          {id:'Color.orange', nombre:'Naranja'}, {id:'Color.pink', nombre:'Rosa'},
          {id:'Color.cyan', nombre:'Celeste'}, {id:'Color.gray', nombre:'Gris'}
      ];

      $scope.tiposRobot = [
          {id:'Spin', nombre:'Gira, Gira y gira'}, //SpinBot extends AdvancedRobot
          {id:'Walls', nombre:'Camina por las paredes'}, //Walls extends Robot
          {id:'Tracker', nombre:'Busca y ataca!'}, //Tracker extends Robot
          {id:'Fire', nombre:'Dispara!!'}, //Fire extends Robot
          {id:'Crazy', nombre:'Robot Loco'}, //Crazy extends AdvancedRobot
          {id:'Corners', nombre:'Esquinas'}, //Corner extends Robot
          {id:'VelociRobot', nombre:'Veloci Robot'} //VelociRobot extends RateControlRobot
          
      ];

      $scope.crearRobot = function () {
        var nameCamelCaseJava = removeSpaces($scope.nombre);
        $scope.openTempMessage("Creando robot " + nameCamelCaseJava + " ...", null, null, true);

        var userId = UserSessionFactory.getUser()._id;
        var colors = [$scope.colorBody.id, $scope.colorGun.id, $scope.colorRadar.id, $scope.colorBullet.id, $scope.colorScanner.id];
        //var features = [$scope.methodHitRobot.id, $scope.methodScannedRobot.id, $scope.methodBulletRobot.id, $scope.methodWallRobot.id];
        //La clase se crea con el nombre que le da el usuario y le concatena al nombre el id de usuario
        //para que no haya clases repetidas ya que todas se crean dentro del mismo package
        var classContent = robotTemplate(nameCamelCaseJava, colors, $scope.robotType.id, userId);
        
        var fileName = nameCamelCaseJava + ".java";
        var request = {'userId': userId, 'name': nameCamelCaseJava, 'fileName': fileName, 'file': classContent};
        
        $http.post(SERVER_URL+'/setRobot', request)

          .success(function(data, status, headers, config) {
            // this callback will be called asynchronously when the response is available
            if(data.error != null){
              $scope.closeTempMessage();
              $scope.openTempMessage("Error: " + data.error, true, null, null);
            }else{
              $scope.closeTempMessage();
              $scope.openTempMessage(nameCamelCaseJava + " se creo con exito! <br/><br/>Ahora vas a ser redirigido a la zona de Batallas para poder competir contra otros robots!<br/><br/>En caso de querer ver y/o modificar el c&oacute;digo fuente de tu robot, tenes que entrar en la opci&oacute;n 'Mis Robots'.", true, null, null, 'CrearBotsCtrl');
            }
          })

          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
            if(data.error != null){
              $scope.closeTempMessage();
              $scope.openTempMessage('Error: ' + data.error, true, null, null);
            }
          });
      };

      $scope.showRobotProperties = function(robotType) {
          $scope.robotProperties = true;
          var htmlOut = robotProperties(robotType.id, robotType.nombre);
          $scope.htmlOut = $sce.trustAsHtml(htmlOut);
      };

      //Se usaba para abrir una ventana popup cuando cambia el valor en un select
      //lo dejo de ejemplo por si hay que volver a hacerlo.
      /*
      $scope.openRobotProperties = function($event, robotType){
          console.log(robotType);
          $event.preventDefault();
      }
      */
}]);




/*** MisBots Controller ***/
tecnoRobocode.controller('MisBotsCtrl', ['$scope', '$http', '$location', '$modal', 'GetRobotsByUser', 'DeleteRobot', 'UserSessionFactory', '$sce', 
      function ($scope, $http, $location, $modal, GetRobotsByUser, DeleteRobot, UserSessionFactory, $sce) {
      
      $scope.currentUser = UserSessionFactory.getUser();
      $scope.setCurrentUser();
      
      //Dado el id de usuario, trae todos los robots que ha creado.
      var userId = UserSessionFactory.getUser()._id;
      GetRobotsByUser.getRobots(userId, function(data){
          $scope.myrobots = data;
      });

      //Haciendo clic en el nombre del robot listado a la derecha, se muestra su contenido
      //en el textArea
      $scope.populateRobotData = function (file, filename, idRobot) { 

        $scope.file = file;
        $scope.fileName = filename;
        $scope.idRobot = idRobot;
      };

       $scope.updateRobot = function () {

          $scope.openTempMessage("Guardando cambios en el robot...", null, null, true);
          var request = {'id': $scope.idRobot, 'file': $scope.file};
          $http.post(SERVER_URL+'/updateRobot', request)

            .success(function(data, status, headers, config) {
              // this callback will be called asynchronously when the response is available
              if(data.error != null){
                  $scope.closeTempMessage();
                  $scope.openTempMessage(data.error, true, null, null);
                  
                  GetRobotsByUser.getRobots(userId, function(data){
                    $scope.myrobots = data;
                  });

              }else{
                  $scope.closeTempMessage();
                  $scope.openTempMessage("El robot se modifico con &eacute;xito!", true, null, null);
                
                  GetRobotsByUser.getRobots(userId, function(data){
                    $scope.myrobots = data;
                  });
              }
            })

            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs or server returns response with an error status.
              if(data.error != null){
                $scope.closeTempMessage();
                $scope.openTempMessage(data.error, true, null, null);
              }
            });
       };


      $scope.deleteRobot = function (idRobot, robotName) {

        $scope.idRobot = idRobot;
        $scope.robotName = robotName;

        var modalInstance = $modal.open({
          templateUrl: 'borrar-robot.html',
          controller: DeleteRobotModalInstanceCtrl,
          resolve: {
            idRobot: function () {
              return $scope.idRobot;
            },
            robotName: function(){
              return $scope.robotName;
            }
          }
        });

        modalInstance.result.then(function () {
          DeleteRobot.deleteRobot(idRobot, function (data){
              var userId = UserSessionFactory.getUser()._id;
              GetRobotsByUser.getRobots(userId, function(data){
                $scope.myrobots = data;
              });
          });
        });
      };
}]);




/*** Competencias Controller ***/
tecnoRobocode.controller('CompetenciasCtrl', ['$scope', '$http', '$filter', '$modal', '$log', 'UserSessionFactory', 'GetRobotsByUser', 'GetArenas', '$sce', 'AddRobotToArena',
    function($scope, $http, $filter, $modal, $log, UserSessionFactory, GetRobotsByUser, GetArenas, $sce, AddRobotToArena) {

        $scope.currentUser = UserSessionFactory.getUser();
        $scope.setCurrentUser();

        var socket = io.connect(SERVER_URL);
        socket.on('result', function (data) {
            //Si los resultados del web socket son de mi arena,
            //me desconecto y capturo los datos.
            //caso contrario no hago nada y sigo esperando...
            if($scope.arenaSelected!=null){
                if(data.result.arenaId == $scope.arenaSelected){
                    //resultado de la batalla.
                    $scope.closeTempMessage();
                    var formattedResults = formatBattleResults(data.result, $scope.arenaName, $scope.robotFighter.name);
                    $scope.openTempMessage(formattedResults, true, null, null);
                    //socket.disconnect();
                    GetArenas.getArenas(function(data){
                      $scope.arenas = data;
                    });
                } // else sigue esperando...
            }
        });

        //Actualiza la información de las batallas en ver competencias
        socket.on('arenaNew', function (data) {
            
            GetArenas.getArenas(function(data){
              $scope.arenas = data;
            });
        });

        GetArenas.getArenas(function(data){
            $scope.arenas = data;
        });

        //Una vez seleccionado el robot de la ventana popup, se agrega el mismo a la Arena (Batalla)
        $scope.selected = function (selected) {

            $scope.robotFighter = selected.r;

            $scope.openTempMessage("El robot " + selected.r.name + " se ha unido a " + selected.an + ".<br/>" + 
            "La batalla comenzar&aacute; en instantes y la vas a ver en el video wall que est&aacute; arriba.<br/><br/>" +
            "Los resultados aparecen en tu pantalla una vez terminado el combate. ", null, null, true);

            var request = {'arenaId': $scope.arenaSelected, 'robotId': selected.r._id};
            //llama al servicio AddRobotToArena getBattleResults
            AddRobotToArena.getBattleResults(request);
        }

        //Dado el id de usuario, trae todos los robots que ha creado el usuario.
        //Se usan para mostrarlos en la ventana popup
        var userId = UserSessionFactory.getUser()._id;
        GetRobotsByUser.getRobots(userId, function(data){
          $scope.myrobots = $filter('filter')(data , { status:'ok'});
        });


        $scope.open = function (idArena, arenaName) {

          $scope.arenaSelected = idArena;
          $scope.arenaName = arenaName;

          var modalInstance = $modal.open({
            templateUrl: 'seleccionarrobot.html',
            controller: ModalInstanceCtrl,
            resolve: {
              robots: function () {
                return $scope.myrobots;
              },
              arenaName: function(){
                return $scope.arenaName;
              }
            }
          });

          modalInstance.result.then(function (selected) {
            $scope.selected(selected);
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };
}]);



/******************** POPUP SELECCIONAR ROBOT PARA LA BATALLA ***************************/
var ModalInstanceCtrl = function ($scope, $modalInstance, robots, arenaName) {
      
    $scope.myrobots = robots;
    $scope.arenaName = arenaName;

    $scope.selected = {
      r: $scope.myrobots[0],
      an: $scope.arenaName
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

/****************************** POPUP PARA ELIMINAR UN ROBOT ****************************/
var DeleteRobotModalInstanceCtrl = function ($scope, $modalInstance, $location, idRobot, robotName) {
      
    $scope.idRobot = idRobot;
    $scope.robotName = robotName;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
};

/************************************** POPUP GENERICO ***********************************/
var GenericPopupModalInstanceCtrl = function ($scope, UserSessionFactory, $location, $modalInstance, $sce, message, showOkButton, showCancelButton, showSpinner, deDondeVengo) {
    
    $scope.message = $sce.trustAsHtml(message);
    $scope.showOkButton = showOkButton;
    $scope.showCancelButton = showCancelButton;
    $scope.showSpinner = showSpinner;
    
    $scope.closePopupOk = function () {
        $modalInstance.dismiss('ok');
        //Una vez creado el robot
        //al hacer clic en aceptar se direcciona a la pagina de mis robots
        if(deDondeVengo == 'CrearBotsCtrl'){
            $location.path('/competencias');
        }

        //Limpia la session y redirecciona al intro
        if(deDondeVengo == 'MainMenuCtrl'){
          UserSessionFactory.clearUser();
          $location.path('/intro');
        }
    };

    $scope.closePopupCancel = function () {
        $modalInstance.dismiss('cancel');
    };
};



/***************************** Funciones - utils *******************************************/
function formatBattleResults(dataResults, arenaName, robotName){
    
    var divWinner = "";
    var divLoser = "";
    var htmlOut = "";
    //Quita la notacion de puntos del nombre del robot. ejemplo com.grupoassa.robocode
    var winner = splitDottedString(dataResults.winner);
    //Si el ganador soy YO
    if(robotName==winner){
      divWinner = "<div><p class='ganador'>Ganaste!!<label></p>";
    }
    //Si el ganador es otro
    if(robotName!=winner){
      divLoser = "<div><label>El ganador es " + winner + "</label></div><br/>";
    }

    htmlOut = "<div><label>Resultados en " + arenaName + "<label></div><br/>" +
            divLoser +
            "<table width='100%' cellpadding='0' cellspacing='0'>" +
            "<tr>" + 
              "<td>Robot</td>" +
              "<td>Puntos</td>" +
              "<td>Deterioro</td>" +
            "</tr>";
            var iterateBots = "";
            for(var i=0; i<dataResults.robotResults.length; i++){
              iterateBots = iterateBots +
              "<tr>" +
                "<td>" + splitDottedString(dataResults.robotResults[i].name) + "</td>" +
                "<td>" + dataResults.robotResults[i].score + "</td>" +
                "<td>" + dataResults.robotResults[i].damage + "</td>" +
              "</tr>";
            };

            htmlOut = htmlOut + iterateBots + "</table></div>";
            var resultHtml = divWinner + htmlOut;

    return resultHtml;
}



function splitDottedString(string){
    var resSplit = string.split(".");
    var resName = "";
    for(var i=0; i<resSplit.length; i++){
        resName = resSplit[i];
    }
    return resName;
}



function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}



//Recorro el nombre. si tiene espacios en blanco se los quito y convierto a CamelCase el nombre.
//ejemplo: este es mi robot quedaria en EsteEsMiRobot
function removeSpaces(string) {
  var nameTmp = string.split(' ');
  var camelCaseName = "";
  for(var i=0; i<nameTmp.length; i++){
    camelCaseName += toTitleCase(nameTmp[i]);
  }
  return camelCaseName;
}

function robotProperties(robotId, robotName){

  var description = null;
  var methodsAndDescriptions = null;

  switch (robotId) {
      case 'Spin':
          description = "Se mueve en un circulo, y dispara con fuerza cuando se detecta a un enemigo";
          methodsAndDescriptions = ['onScannedRobot', 'Disparar con fuerza! m&aacute;xima intensidad 3', '&nbsp;', 'onHitRobot', 'Si es culpa nuestra, dejar de girar y moverse, luego girar de nuevo y seguir girando'];
          break;
      case 'Walls':
          description = "Se mueve alrededor del borde exterior apuntando todo el tiempo hacia adentro";
          methodsAndDescriptions = ['onScannedRobot', 'Dispara con intensidad 2', 'onHitRobot', 'Alejarse un poco'];
          break;
      case 'Tracker':
          description = "Se fija a un robot, se acerca y empieza a dispararle cuando esta cerca";
          methodsAndDescriptions = ['onScannedRobot', '', '&nbsp;', 'onHitRobot', 'Se pone como nuevo objetivo dispararle a ese robot', '&nbsp;', 'onWin', 'Hace el baile de la victoria.'];
          break;
      case 'Fire':
          description = "Se queda quieto. Gira la mira en busca de robots para disparar. Se mueve al ser golpeado.";
          methodsAndDescriptions = ['onScannedRobot', 'Si el otro robot esta cerca, y tenemos un mont&oacute;n de vida, Disparar con m&aacute;xima intensidad 3! de lo contrario, disparar con m&iacute;nima intensidad 1.', '&nbsp;', 'onHitByBullet', 'Girar en forma perpendicular al disparo, y moverse un poco.', '&nbsp;', 'onHitRobot', 'Apuntarle y dispararle con fuerza. M&aacute;xima intensidad 3'];
          break;
      case 'Crazy':
          description = "Este robot se mueve en torno a un modelo loco. Hacia todos lados";
          methodsAndDescriptions = ['onScannedRobot', 'Dispara con intensidad minima. Intensidad 1', '&nbsp;', 'onHitWall', 'Maneja la colision contra la pared. Toma la direcci&oacute;n contraria', '&nbsp;', 'onHitRobot' , 'Retrocede. Y si fue mi culpa, toma la direcci&oacute;n contraria'];
          break;
      case 'Corners':
          description = "Este robot se mueve a una esquina y se queda ahi. Balancea la mira de un lado a otro y dispara. Si muere, intenta un nuevo rincon en la siguiente batalla.";
          methodsAndDescriptions = ['onScannedRobot', 'Detenerse y disparar! Este robot utiliza el m&eacute;todo smartFire. El cual cambia la intesidad de disparo seg&uacute;n la cercan&iacute;a de los otros robots y nuestra energia disponible', '&nbsp;', 'onDeath', 'Hemos muerto. Se decide si vamos a probar una esquina diferente para la pr&oacute;xima batalla basandonos en que si el 75% de los robots siguen con vida cuando morimos, nos cambiamos de esquina.'];
          break;
      case 'VelociRobot':
          description = "Este es un robot de pruebas experimental, que utiliza la clase RateControlRobot";
          methodsAndDescriptions = ['onScannedRobot', 'Dispara intesidad 1','&nbsp;' , 'onHitByBullet', 'Gira para confundir a los otros robots','&nbsp;', 'onHitWall', 'Se aleja de la pared'];
          break;
  }

  var htmlOut = "<div class='robot-properties'>" +
          "   <table width='100%'>" +
          "    <tr>" +
          "    <td colspan='2'><label>Propiedades de " + robotName + "<label></td>" +
          "    </tr>" +
          "    <tr>" +
          "      <td colspan='2'>&nbsp;</td>" +
          "    </tr>" +
          "    <tr>" +
          "      <td colspan='2'><label>" + description + "<label></td>" +
          "    </tr>" +
          "    <tr>" +
          "      <td colspan='2'>&nbsp;</td>" +
          "    </tr>" +
          "    <tr>" +
          "      <td colspan='2'><label>M&eacute;todos que utiliza<label></td>" +
          "    </tr>" +
          "    <tr><td colspan='2'>&nbsp;</td></tr>";
          
          for(var i=0; i<methodsAndDescriptions.length; i++){
          htmlOut = htmlOut + "<tr>" +
          "      <td colspan='2'><label>" + methodsAndDescriptions[i] + "<label></td>" +
          "    </tr>";
          }
          htmlOut = htmlOut + "  </table></div>";

  return htmlOut;

}