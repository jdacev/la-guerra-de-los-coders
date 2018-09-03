'use strict';

/**************** Services *****************/
var robocodeServices = angular.module('tecnopolis-robocode.services', []);


/*** UserSessionFactory ***/
robocodeServices.factory('UserSessionFactory', function ($window) {
      
      return {
        setUser: function (loggedUser) {
          $window.sessionStorage.setItem('currentUser', JSON.stringify(loggedUser));
        },

        getUser: function(){
          var currentUser = $window.sessionStorage.getItem('currentUser');
          return JSON.parse(currentUser);
        },

        clearUser: function(){
            $window.sessionStorage.clear();
        }
      };
});



/*** GetRobotsByUser ***/
robocodeServices.factory('GetRobotsByUser', function ($http) {
      
      return {
        getRobots: function(userId, callback){

      		 $http({method: 'GET', url: SERVER_URL + '/user/'+ userId + '/robots'})
              .success(function(data, status, headers, config) {
      		      // this callback will be called asynchronously when the response is available
                if(data.error != null){
                  return data.error;
                }else{
                   //usamos un callback porque como la llamada es asincronica, pasa de largo y termina cargando el scope vacio.
                  callback(data);
                }
      		    })
              .error(function(data, status, headers, config) {
      		      // called asynchronously if an error occurs or server returns response with an error status.
                if(data.error != null){
                  return data.error;
                }
      		  });
        }
      };
});



robocodeServices.factory('GetArenas', function ($http) {
      
      return {
        getArenas: function(callback){

           $http.get(SERVER_URL + '/arenas')
              .success(function(data, status, headers, config) {
                // this callback will be called asynchronously when the response is available
                if(data.error != null){
                  return data.error;
                }else{
                   //usamos un callback porque como la llamada es asincronica,
                   //pasa de largo y termina cargando el scope vacio.
                  callback(data);
                }
              })

              .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs or server returns response with an error status.
                if(data.error != null){
                  return data.error;
                }
            });
        }
      };
});



robocodeServices.factory('AddRobotToArena', function ($http) {
      
      return {
        getBattleResults: function(request){

          $http.post(SERVER_URL + '/addRobotToArena', request)

            .success(function(data, status, headers, config) {
              // this callback will be called asynchronously when the response is available
              if(data.error != null){
                  return 'Error: ' + data.error;
              }
            })

            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs or server returns response with an error status.
              if(data.error != null){
                return data.error;
              }else{
                //Se produjo un error de comunicacion al server.
                return "net::ERR_CONNECTION_REFUSED";
              }
            });
        }
      };
});



/*** DeleteRobot ***/
robocodeServices.factory('DeleteRobot', function ($http) {
  
    return {
      deleteRobot: function(idRobot, callback){

        //$http.delete(SERVER_URL + '/robot', idRobot)
        $http({method: 'DELETE', url: SERVER_URL + '/robot/'+ idRobot})

          .success(function(data, status, headers, config) {
            // this callback will be called asynchronously when the response is available
            if(data.error != null){
                return data.error;
            }else{
                callback(data);
            }
          })

          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
              if(data.error != null){
                return data.error;
              }else{
                //Se produjo un error de comunicacion al server.
                return "net::ERR_CONNECTION_REFUSED";
              }
          });
        }
    };
});



/*** CompetenciasSocket ***/
robocodeServices.factory('CompetenciasSocket', ['$q', '$rootScope', function($q, $rootScope) { 
    
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = new WebSocket("ws://localhost:9000/");
    
    ws.onopen = function(){  
        console.log("Socket has been opened!");
    };
    
    ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };

    function sendRequest(request) {
      var defer = $q.defer();
      var callbackId = getCallbackId();
      callbacks[callbackId] = {
        time: new Date(),
        cb:defer
      };
      request.callback_id = callbackId;
      console.log('Sending request', request);
      ws.send(JSON.stringify(request));
      return defer.promise;
    }

    function listener(data) {
      var messageObj = data;
      console.log("Received data from websocket: ", messageObj);
      // If an object exists with callback_id in our callbacks object, resolve it
      if(callbacks.hasOwnProperty(messageObj.callback_id)) {
        console.log(callbacks[messageObj.callback_id]);
        $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
        delete callbacks[messageObj.callbackID];
      }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }

    // Define a "getter" for getting customer data
    Service.getBattleResults = function() {
      var request = {
        type: "get_battle_results"
      }
      // Storing in a variable for clarity on what sendRequest returns
      var promise = sendRequest(request); 
      return promise;
    }
    return Service;
}]);