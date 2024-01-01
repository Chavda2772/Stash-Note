Ext.define("myApp.view.desktop.todo.TodoController", {
    extend: "Ext.app.ViewController",

    alias: "controller.todoController",

    control: {
        "#": {
            initialize: 'onInit'
        },
    },

    onInit: function () {
        if (!!tinyMCE.get('todoDescriptionArea')) {
            tinyMCE.get('todoDescriptionArea').remove();
        }
    },

    onOperationPerformed: function (todoDetail, mode) {
        this.getView().lookupReference("rfTodoList").fireEvent("operationPerformed", todoDetail, mode);
    },

    loadTodoDetails: function (todoDetail) {
        this.getView().lookupReference("rfTodoDetails").fireEvent("loadDetail", todoDetail);
    },

    onAddTodo: function (todoId) {
        this.getView().lookupReference("rfTodoDetails").fireEvent('addTodo', todoId);
    },
    onTodoCountUpdate: function (todoCount) {
        this.getView().lookupReference("rfTodoDetails").fireEvent('todoCountUpdate', todoCount);
    },
    onToggleComplete: function (updateVal) {
        this.getView().lookupReference("rfTodoList").fireEvent("toggleComplete", updateVal);
    }

});
