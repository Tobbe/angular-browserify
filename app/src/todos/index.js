'use strict';

var todos = require('angular').module('todos', []);

todos.controller('EditTodoCtrl', require('./todos-edit-controller'));
todos.controller('TodoCtrl', require('./todos-controller'));
todos.controller('TodoListCtrl', require('./todos-list-controller'));
todos.service('TodoService', require('./todos-service'));
