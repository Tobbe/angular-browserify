'use strict';

require('es5-shim');
require('es5-sham');

require('jquery');
var angular = require('angular');
require('angular-route');

require('./index');

var app = angular.module('todoApp', [ 'ngRoute', 'imprint', 'todos' ]);

app.controller('FooterCtrl', require('./app-footer-controller'));

app.constant('VERSION', require('../../package.json').version);

app.config(function($routeProvider) {
    $routeProvider
        .when('/todos', {
            templateUrl: 'src/todos/todos.html',
            controller: 'TodoCtrl',
        })
        .when('/imprint', {
            templateUrl: 'src/imprint/imprint.html',
            controller: 'ImprintCtrl',
        })
        .otherwise({
            redirectTo: '/todos',
        });
});
