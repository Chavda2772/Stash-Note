Ext.define('myApp.view.phone.todo.Todo', {
    extend: 'Ext.Panel',

    requires: [
        'myApp.view.desktop.todolist.List',
        'myApp.view.desktop.tododetail.TodoDetail',
        'myApp.view.desktop.settings.Settings',
        'myApp.view.phone.todo.TodoController',
        'myApp.view.phone.main.nav.NavViewPh'
    ],

    xtype: 'phoneTodo',
    controller: 'phoneTodoController',
    viewModel: {
        data: {
            activeView: Enums.mobileViews.todoList,
        },
    },

    cls: 'mainPanel',
    header: {
        cls: 'todoHeader',
        title: 'Todos',
    },
    flex: 1,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'navviewph',
            reference: 'rfNavMenu',
            maxWidth: 45,
            padding: 0,
        },
        {
            xtype: 'panel',
            flex: 1,
            items: [
                {
                    xtype: 'todoList',
                    fullscreen: true,
                    reference: 'rfTodoList',
                    bind: {
                        hidden: '{activeView != "' + Enums.mobileViews.todoList + '"}'
                    },
                    listeners: {
                        loadDetails: 'loadTodoDetails',
                        addTodo: 'onAddTodo',
                    }
                },
                {
                    xtype: 'todoDetail',
                    reference: 'rfTodoDetails',
                    fullscreen: true,
                    bind: {
                        hidden: '{activeView != "' + Enums.mobileViews.todoDetails + '"}'
                    },
                    listeners: {
                        backDetails: 'onBackPressed',
                        operationPerformed: 'onOperationPerformed'
                    }
                },
                {
                    xtype: 'settings',
                    reference: 'rfSettings',
                    fullscreen: true,
                    bind: {
                        hidden: '{activeView != "' + Enums.mobileViews.settings + '"}'
                    },
                }
            ]
        },
    ],
});