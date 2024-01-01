Ext.define('todo.view.desktop.todolist.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.listController',

    control: {
        '#': {
            initialize: 'onInitialize',
            refreshList: 'RefreshList',
            operationPerformed: 'onOperationPerformed',
            toggleComplete: 'onToggleComplete'
        }
    },

    listen: {
        store: {
            '#todoTreeListStore': {
                load: 'listStoreLoad',
                beforeload: 'listStoreBeforeLoad',
            }
        }
    },

    listStoreBeforeLoad: function (store, operation, eOpts) {
        this.getView().setMasked('Loading ...');
    },

    onBeforeExpand: function (row, record, eOpts) {
        var me = this,
            list = me.getView().lookupReference('rfTodoList');

        if (!!list.getStore() && !!record) {
            list.getStore().getProxy().getReader().data.parentId = record.data.TodoId;
        }
    },

    listStoreLoad: function (store) {
        var me = this;
        var view = me.getView();

        //This Defer is used to select first record if not selected 
        Ext.defer(function () {
            me.onPainted();
        }, 10);
        view.setMasked(false);
    },

    onInitialize: function (panel, eOpts) {
        var me = this;
        me.addTreeContextMenu();
    },

    addTreeContextMenu: function () {
        var me = this,
            view = me.getView(),
            tree = view.lookupReference('rfTodoList');

        var contextMenu = Ext.create({
            xtype: 'menu',
            floated: true,
            width: 150,
            bodyCls: 'menu-padding',
            items: [
                {
                    text: 'Add',
                    iconCls: 'x-fa fa-plus',
                    handler: function () {
                        me.addChildTodo(tree.getSelection().data.TodoId);
                        contextMenu.hide();
                    },
                },
                {
                    iconCls: 'x-fa fa-trash-alt',
                    text: 'Delete',
                    handler: function () {
                        Ext.Msg.confirm('Warning !!!', 'Are you sure you wan"t to Delete.</br>Action cannot undo ..???', function (choice) {
                            if (choice == "yes") {
                                me.deleteTodo(tree.getSelection());
                            }
                            contextMenu.hide();
                        });
                    }
                }
            ]
        });

        tree.on("itemcontextmenu", function (tree, record, item, index, e) {
            e.stopEvent();
            tree.deselectAll();
            tree.setSelection(index);
            contextMenu.showAt(e.getXY());
        });
    },

    addChildTodo: function (todoId) {
        this.getView().fireEvent('addTodo', todoId);
    },

    deleteTodo: function (selection) {
        var me = this,
            view = me.getView();

        Proxy.todos.deleteTodo(selection.data.TodoId, function (data) {
            if (data) {
                me.removeTreeNode(selection);
            }
        }, function (data) {
            Ext.Msg.alert('Error', data.message);
        });
    },

    onAddNewTodo: function () {
        var view = this.getView(),
            treelist = view.lookupReference('rfTodoList');

        treelist.deselectAll();
        view.fireEvent('addTodo', null);
    },

    RefreshList: function () {
        var list = this.getView().lookupReference('rfTodoList'),
            store = list.getStore();

        store.getProxy().getReader().data.parentId = 0;
        store.clearFilter();
        store.load();
    },

    listItemsCheckChange: function (cell, checked, record, e, eOpts) {
        var me = this;
        var todoId = record.get("TodoId");
        var chkValue = checked ? 1 : 0;
        var treelist = me.getView().lookupReference('rfTodoList');

        Proxy.todos.todoCheckChange(todoId, chkValue, function (data) {
            if (data) {
                Ext.toast("Task Status Changed Successfully.");
                if (!!chkValue) {
                    record.data.checked = true;
                }
                else {
                    record.data.checked = false;
                }
                record.data.IsCompleted = chkValue;
                treelist.refresh();
            }
            else {
                Ext.toast(resData.data.message);
            }
        }, function (data) {
            Ext.Msg.alert(data.message);
        });
    },

    todoTreeListSelect: function (tree, selected, eOpts) {
        var me = this,
            view = me.getView();

        view.fireEvent('loadDetails', selected.data.TodoId);
        if (!selected.data.expanded && !!selected.data.HasChild) {
            me.onBeforeExpand(null, selected);
            selected.expand();
        }

    },

    markAllAsCompleted: function (item) {
        var me = this,
            list = me.getView().lookupReference('rfTodoList'),
            todoItemName = Enums.localStorageKeys.todoItems,
            storageTodos = commonFunction.readLocalData(todoItemName) || [];

        if (!!storageTodos.length) {

            Ext.Msg.confirm('Warning !!', `Are you sure want Mark All as ${item.isMark ? 'Completed' : 'Not Completed'} ??`, function (choice) {
                if (choice == 'yes') {
                    storageTodos.forEach(function (todo) {
                        todo.IsCompleted = item.isMark ? 1 : 0;
                    });

                    commonFunction.writeLocalData(todoItemName, storageTodos);
                    if (item.isMark) {
                        Ext.toast("All task mark as COMPLETED.");
                    }
                    else {
                        Ext.toast("All task mark as NOT COMPLETED.");
                    }

                    //Refresh list manually
                    list.getStore().data.items.forEach(function (todo) {
                        todo.data.checked = item.isMark;
                    });

                    list.refresh();
                }
            });
        }
        else {
            Ext.toast("No todo found !!");
        }

    },

    deleteCompletedTask: function (item) {
        var me = this,
            storageTodos = commonFunction.readLocalData(Enums.localStorageKeys.todoItems) || [];

        if (!!storageTodos.length) {
            Ext.Msg.confirm('Warning !!', "It also delete all the child's of Completed Todos !!</br>Are you sure you want to delete completed task ?",
                function (choice) {
                    if (choice == "yes") {

                        storageTodos.forEach(function (todo) {
                            if (!!todo.IsCompleted) {
                                Proxy.todos.deleteTodo(todo.TodoId, function () { }, function () { });
                            }
                        });

                        Ext.toast("Completed Task deleted Successfully.");
                        me.RefreshList();
                    }
                });
        }
        else {
            Ext.toast("No todos found !!");
        }

    },

    filterHideCompleted: function () {
        var me = this,
            view = me.getView(),
            listStore = view.lookupReference('rfTodoList').getStore();

        if (!!listStore.data.items.length) {
            listStore.filterBy(function (todoData) {
                if (!todoData.data.root) {
                    if (!todoData.get('IsCompleted')) {
                        return true;
                    }
                    return false;
                }
            });
        }
        else {
            Ext.toast("No Todos found !!");
        }

    },

    onClearFilter: function () {
        var me = this,
            view = me.getView(),
            menu = view.lookupReference('rfFilterMenu'),
            menuItems = menu.getMenu().getItems().items;

        me.lookupReference('rfTodoList').getStore().clearFilter();
        Ext.each(menuItems, function (item) {
            if (typeof item.getChecked === "function") {
                item.setChecked(false);
            }
        });
        menu.show();
    },

    onTodoListFilter: function () {
        var me = this,
            view = me.getView(),
            menu = view.lookupReference('rfFilterMenu').getMenu(),
            menuItems = menu.getItems().items,
            list = me.lookupReference('rfTodoList');

        list.setMasked('Loading ...');
        list.getStore().clearFilter();

        Ext.each(menuItems, function (item) {
            if (typeof item.getChecked === "function") {
                if (item.getChecked()) {
                    if (typeof me[item.FilterHandler] === "function") {
                        me[item.FilterHandler]();
                    }
                }
            }
        });

        list.setMasked(false);
    },

    filterTodaysList: function () {
        var me = this,
            view = me.getView(),
            listStore = view.lookupReference('rfTodoList').getStore();

        if (!!listStore.data.items.length) {
            listStore.filterBy(function (todoData) {
                if (!todoData.data.root) {
                    var todoDate = new Date(todoData.data.CreatedOn);
                    var currentDate = new Date();

                    if (currentDate.getFullYear() == todoDate.getFullYear()
                        && currentDate.getMonth() == todoDate.getMonth()
                        && currentDate.getDay() == todoDate.getDay()
                    ) {
                        return true;
                    }
                    return false;
                }
            });
        }
        else {
            Ext.toast("No Todos found !!");
        }

    },

    onOperationPerformed: function (todoDetails, mode) {
        var me = this,
            view = me.getView(),
            list = view.lookupReference('rfTodoList'),
            store = list.getStore(),
            selection = list.getSelection();

        if (mode == Enums.todoModes.add) {
            //Adding new Todo
            if (!!todoDetails.ParentId &&
                selection.data.TodoId == todoDetails.ParentId) {

                if (!!selection.childNodes.length || !selection.data.HasChild) {
                    selection.set('HasChild', 1);
                    selection.set('iconCls', 'x-fa fa-folder');
                    selection.appendChild(todoDetails);
                }

                //If node not expanded then expand
                if (!selection.data.expanded) {
                    me.onBeforeExpand(null, selection);
                    selection.expand();
                }

            }
            else {
                var record = list.getStore().add(todoDetails);
                if (Ext.platformTags.desktop) {
                    list.setSelection(record[0]);
                }
            }
        }
        else if (mode == Enums.todoModes.edit) {
            //When Edit action is performed
            var sel = selection.data;
            Ext.Object.merge(sel, todoDetails);
        }
        else if (mode == Enums.todoModes.delete) {
            //Delete action is performed
            me.removeTreeNode(selection);
        }
        else {
            store.clearFilter();
            store.getProxy().getReader().data.parentId = 0;
            store.load();
        }

        list.refresh();

        if (!list.getSelection() && Ext.platformTags.desktop) {
            list.setSelection(store.getAt(0));
        }

    },

    onPainted: function () {
        var me = this;
        var view = me.getView();
        var todoList = me.getView().lookupReference('rfTodoList');
        var store = todoList.getStore();

        view.fireEvent('todoCountUpdate', store.getData().items.length);
        if (!todoList.getSelection() && Ext.platformTags.desktop) {
            todoList.setSelection(store.getAt(0));
        }
    },

    removeTreeNode: function (node) {
        var me = this;
        var view = me.getView();
        var treelist = view.lookupReference('rfTodoList'),
            parentIdx,
            childNodes = [];

        //Refresh store Data manually
        if (node.parentNode)
            node.parentNode.removeChild(node);
        else 
            me.RefreshList();

        //If has parent then check list of child is null then set Leaf true
        if (node.data.ParentId != 0) {
            treelist.getStore().data.items.forEach(function (todo, idx) {
                if (todo.data.ParentId == node.data.ParentId) {
                    childNodes.push(todo);
                }
                else if (todo.data.TodoId == node.data.ParentId) {
                    parentIdx = idx;
                }
            });
        }

        if (!childNodes.length && parentIdx != undefined) {
            var parentIdxData = treelist.getStore().data.items[parentIdx].data;
            parentIdxData.leaf = true;
            parentIdxData.HasChild = 0;
            parentIdxData.iconCls = 'x-fa fa-file-alt';
        }

        treelist.refresh();
        view.fireEvent('todoCountUpdate', treelist.dataItems.length);
        Ext.toast("Todo Removed Successfully.");

        if (!treelist.getSelection() && Ext.platformTags.desktop) {
            treelist.setSelection(treelist.getStore().getAt(0));
        }
    },
    onToggleComplete: function (newVal) {
        var me = this;
        var todoList = me.getView().lookupReference('rfTodoList');

        todoList.getSelected().items[0].data.checked = newVal;
        todoList.refresh();
    }
});