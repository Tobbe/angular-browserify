'use strict';

var TodoPage = require('./pages/todo_page');

describe('The todo app (deleting a todo)', function() {

    var todoPage;

    beforeEach(function() {
        todoPage = new TodoPage();
        todoPage.open();
    });

    it('should delete a todo', function() {
        todoPage.sidebarItem(2).click();
        todoPage.del();
        expect(todoPage.sidebarItems().count()).toEqual(3);
    });

});
