Ext.define("myApp.view.phone.todo.TodoController", {
    extend: "Ext.app.ViewController",

    alias: "controller.phoneTodoController",

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    onOperationPerformed: function () {
        this.getView().lookupReference("rfTodoList").fireEvent("refreshList");
    },

    loadTodoDetails: function (todoDetail) {
        var me = this,
            view = me.getView();

        view.getViewModel().set('activeView', Enums.mobileViews.todoDetails);
        view.lookupReference('rfTodoDetails').fireEvent('loadDetail', todoDetail);
    },

    onBackPressed: function () {
        this.getView().getViewModel().set('activeView', Enums.mobileViews.todoList);
    },

    onOperationPerformed: function (todoDetail, mode) {
        var view = this.getView();

        view.getViewModel().set('activeView', Enums.mobileViews.todoList);
        view.lookupReference("rfTodoList").fireEvent("operationPerformed", todoDetail, mode);
    },

    onAddTodo: function (todoId) {
        var view = this.getView();

        view.getViewModel().set('activeView', Enums.mobileViews.todoDetails);
        view.lookupReference("rfTodoDetails").fireEvent('addTodo', todoId);
    },

    onUnmatchedRoute: function (token) {
        var me = this,
            view = me.getView(),
            EnmViews = Enums.mobileViews,
            navMenu = view.lookupReference('rfNavMenu'),
            loadView;

        Object.values(EnmViews).forEach(function (menu) {
            if (token == menu) {
                loadView = menu;
            }
        });

        if (!loadView) {
            me.redirectTo(EnmViews[Object.keys(EnmViews)[0]]);
            return true;
        }

        navMenu.fireEvent('viewLoad', loadView);
        view.getViewModel().set('activeView', loadView);
    },

});
