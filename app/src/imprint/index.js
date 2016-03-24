'use strict';
var imprint = require('angular').module('imprint', []);
imprint.controller('ImprintCtrl', require('./imprint-controller'));
imprint.service('ImprintService', require('./imprint-service'));
