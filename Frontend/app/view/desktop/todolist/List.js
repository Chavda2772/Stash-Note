Ext.define('myApp.view.desktop.todolist.List', {
    extend: 'Ext.Panel',

    requires: [
        'Ext.data.TreeStore',
        'Ext.grid.plugin.TreeDragDrop'
    ],

    xtype: 'todoList',
    controller: 'listController',
    viewModel: {
        data: {
            isFiltered: false,
        }
    },

    flex: 1,
    tbar: {
        bodyCls: 'todoList-header',
        shadow: false,
        items: [
            {
                xtype: 'button',
                iconCls: 'x-fa fa-ellipsis-v',
                arrow: false,
                menu: {
                    bodyCls: 'menu-padding',
                    items: [
                        {
                            text: 'Add Todo',
                            iconCls: 'x-fa fa-plus',
                            handler: 'onAddNewTodo',
                        },
                        {
                            text: 'Refresh',
                            iconCls: 'x-fa fa-redo-alt',
                            handler: 'RefreshList'
                        },
                        {
                            text: 'Collapse All',
                            hidden: true,
                        },
                        {
                            text: 'Expand All',
                            hidden: true,
                        },
                        {
                            text: "Complete All",
                            isMark: true,
                            iconCls: 'x-fa fa-check-double',
                            handler: 'markAllAsCompleted'
                        },
                        {
                            text: "Incomplete All",
                            isMark: false,
                            iconCls: 'x-fa fa-calendar-times',
                            handler: 'markAllAsCompleted'
                        },
                        {
                            text: "Deleted All Completed",
                            iconCls: 'x-fa fa-trash',
                            handler: 'deleteCompletedTask'
                        },
                    ]
                }
            },
            '->', {
                xtype: 'button',
                iconCls: 'x-fa fa-filter',
                arrow: false,
                reference: 'rfFilterMenu',
                tooltip: 'Filter',
                menu: {
                    bodyCls: 'menu-padding',
                    items: [
                        {
                            text: "Today's Todo",
                            iconCls: 'x-fa fa-calendar-day',
                            checked: false,
                            IsFilter: true,
                            FilterHandler: 'filterTodaysList',
                            listeners: {
                                checkchange: 'onTodoListFilter'
                            }
                        },
                        {
                            text: "Hide Completed",
                            checked: false,
                            iconCls: 'x-fa fa-calendar-times',
                            IsFilter: true,
                            FilterHandler: 'filterHideCompleted',
                            listeners: {
                                checkchange: 'onTodoListFilter'
                            }
                        },
                        {
                            text: "Clear Filter",
                            iconCls: 'x-fa fa-ban',
                            handler: 'onClearFilter'
                        },
                    ]
                }
            }
        ],
    },

    items: [{
        xtype: 'tree',
        reference: 'rfTodoList',
        scrollable: true,
        rootVisible: false,
        hideHeaders: true,
        selectable: { mode: 'single' },
        height: '100%',
        emptyText: 'There are no Todo available.',
        //plugins: {
        //    treedragdrop: true
        //},
        columns: [{
            xtype: 'treecolumn',
            text: 'Todos',
            width: '100%',
            dataIndex: 'Title',
        }],
        store: {
            type: 'todoTreeListStore',
        },
        listeners: {
            select: 'todoTreeListSelect',
            checkchange: 'listItemsCheckChange',
            //painted: 'onPainted',
            beforenodeexpand: 'onBeforeExpand',
        }
    }],
});