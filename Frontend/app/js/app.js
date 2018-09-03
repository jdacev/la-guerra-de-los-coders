'use strict';

// Declare app level module which depends on filters, and services
angular.module('tecnopolis-robocode', [
  	'ngRoute',
  	'ui.bootstrap',
  	'tecnopolis-robocode.filters',
  	'tecnopolis-robocode.services',
  	'tecnopolis-robocode.controllers'
	])
	
	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider
			.when('/misbots',
				{templateUrl: 'partials/misbots.html', controller: 'MisBotsCtrl'})
	  		.when('/bienvenido',
				{templateUrl: 'partials/bienvenido.html', controller: 'BienvenidoCtrl'})
			.when('/crearbot',
				{templateUrl: 'partials/crearbots.html', controller: 'CrearBotsCtrl'})
			.when('/competencias',
				{templateUrl: 'partials/competencias.html', controller: 'CompetenciasCtrl'})
			.when('/login',
				{templateUrl: 'partials/login.html', controller: 'LoginCtrl'})
			.when('/intro',
				{templateUrl: 'partials/intro.html', controller: 'IntroCtrl'})
			.otherwise(
				{redirectTo: '/intro'});
	}])
;