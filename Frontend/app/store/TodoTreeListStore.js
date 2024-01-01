Ext.define('myApp.store.TodoTreeListStore', {
    extend: 'Ext.data.TreeStore',

    alias: 'store.todoTreeListStore',
    storeId: 'todoTreeListStore',

    model: 'myApp.model.TodoTreeListModel',
    data: [],
    root: {
        text: 'Todos',
        expanded: true,
    },
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            data: {
                parentId: 0,
            },
            transform: function () {
                var readerInit = this.initialConfig,
                    todos = commonFunction.readLocalData(Enums.localStorageKeys.todoItems),
                    LevelNodes = [];

                if (!!readerInit) {
                    var parentId = readerInit.data.parentId;

                    Ext.each(todos, function (todo) {
                        if (todo.ParentId == parentId) {
                            LevelNodes.push(todo);
                        }
                    });
                }

                return LevelNodes;
            }
        },
    },

});