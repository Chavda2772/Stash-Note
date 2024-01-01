Ext.define('myApp.proxy.Todos', {
    alternateClassName: 'Proxy.todos',
    singleton: true,

    //Methods
    getTodoByTodoId: function (todoId, success, error) {
        var data = commonFunction.readLocalData(Enums.localStorageKeys.todoItems) || [];

        data.find((todo) => {
            if (todo.TodoId == todoId) {
                return success(todo);
            }
        });
    },

    todoCheckChange: function (todoId, changeValue, success, error) {

        var todoItemName = Enums.localStorageKeys.todoItems;
        var data = commonFunction.readLocalData(todoItemName) || [];

        data.forEach((todo, idx) => {
            if (todoId == todo.TodoId) {
                data[idx].IsCompleted = changeValue;
            }
        });

        var rtnData = commonFunction.writeLocalData(todoItemName, data);
        if (rtnData) {
            return success(true);
        }
        else {
            return error(false);
        }
    },

    updateTodoDetail: function (todoDetail, success, error) {

        var todoItemName = Enums.localStorageKeys.todoItems;
        var data = commonFunction.readLocalData(todoItemName) || [];

        data.forEach((todo, idx) => {
            if (todoDetail.TodoId == todo.TodoId) {
                data[idx] = Ext.merge(data[idx], todoDetail);
            }
        });

        var rtnData = commonFunction.writeLocalData(todoItemName, data);
        if (rtnData) {
            return success(true);
        }
        else {
            return error(false);
        }
    },

    addTodo: function (todoDetail, isChild, success, error) {
        var todoItemName = Enums.localStorageKeys.todoItems;
        var data = commonFunction.readLocalData(todoItemName) || [];

        todoDetail.TodoId = commonFunction.getTodoId();
        data.push(todoDetail);

        var rtnData = commonFunction.writeLocalData(todoItemName, data);
        if (rtnData) {
            commonFunction.incrementNextTodoId();
            if (isChild == 1) {
                commonFunction.updateField(Enums.localStorageKeys.todoItems, todoDetail.ParentId, 'HasChild', isChild);
            }
            return success(rtnData);
        }
        else {
            return error(rtnData);
        }
    },

    deleteTodo: function (todoId, success, error) {
        var todoItemName = Enums.localStorageKeys.todoItems,
            data = commonFunction.readLocalData(todoItemName) || [],
            deleteTodo = {},
            newTodos = [],
            remainTodo = [],
            prentLevelOfChild = [];

        //Grab delete Todo and Fill remaining items in Array
        for (const todo of data) {
            if (todoId == todo.TodoId) {
                deleteTodo = todo;
            }
            else {
                newTodos.push(todo);
            }
        }

        //Find Parent Node
        var parentNode = data.find(function (todo) {
            return todo.TodoId == deleteTodo.ParentId;
        });

        //Fetch number of child of the parent node If node has Parent.
        if (!!parentNode) {
            //Fetch number of childs and push to arrary
            for (const todo of newTodos) {
                if (todo.ParentId == parentNode.TodoId) {
                    prentLevelOfChild.push(todo);
                }
            }

            //modify parent's HasChild Property if no child found
            if (!prentLevelOfChild.length) {
                for (const todo of newTodos) {
                    if (todo.TodoId == deleteTodo.ParentId) {
                        todo.HasChild = 0;
                        break;
                    }
                }
            }

            remainTodo = newTodos;
        }
        else {
            remainTodo = newTodos;
        }

        //Remove all sub N level childs of the deleted todo if hasChild
        if (!!deleteTodo.HasChild) {
            remainTodo = commonFunction.deleteSubChilds(newTodos, deleteTodo.TodoId);
        }

        if (commonFunction.writeLocalData(todoItemName, remainTodo)) {
            return success(true);
        }
        else {
            return error(false);
        }
    },

});