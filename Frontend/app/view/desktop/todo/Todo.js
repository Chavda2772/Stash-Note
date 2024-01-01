Ext.define('myApp.view.desktop.todo.Todo', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.panel.Resizer',
        'myApp.view.desktop.todolist.List',
        'myApp.view.desktop.tododetail.TodoDetail'
    ],

    xtype: 'todo',
    controller: 'todoController',

    layout: 'hbox',
    header: {
        cls: 'todoHeader',
        title: 'Stash Note',
    },
    tools: [
        {
            xtype: 'button',
            iconCls: 'userIcon',
            tooltip: 'account',
            anchor: true,
            hidden: true,
            menu: {
                items: [
                    {
                        xtype: 'button',
                        text: 'Account',
                        hidden: true,
                    },
                    {
                        xtype: 'button',
                        text: 'logout',
                        handler: 'onLogout',
                    }

                ]
            }
        },
    ],
    items: [
        {
            xtype: 'todoList',
            reference: 'rfTodoList',
            minWidth: 300,
            flex: 1,
            cls: 'todolist-resizer',
            resizable: {
                split: true,
                edges: 'east'
            },
            listeners: {
                loadDetails: 'loadTodoDetails',
                addTodo: 'onAddTodo',
                todoCountUpdate: 'onTodoCountUpdate'
            }
        },
        {
            xtype: 'todoDetail',
            reference: 'rfTodoDetails',
            columnResize: false,
            flex: 3,
            listeners: {
                operationPerformed: 'onOperationPerformed',
                toggleComplete: 'onToggleComplete'
            }
        }
    ]
});