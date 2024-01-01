Ext.define('myApp.view.desktop.tododetail.TodoDetailVM', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.todoDetailVM',

    data: {
        todoId: 0,
        mode: Enums.todoModes.readOnly,
        todoDesc: "Title Description",
        ParentId: 0,
        firstLoad: false,
        isBlankPageVisible: false,
        todoListCount: 0
    },

    formulas: {
        addEditButtonCls: {
            get: function (rec) {
                if (rec("mode") == Enums.todoModes.readOnly) {
                    return "x-fa fa-pencil-alt edit";
                } else {
                    return "x-fa fa-ban cancel";
                }
            },
        },

        addEditButtonTooltip: {
            get: function (rec) {
                if (rec("mode") == Enums.todoModes.readOnly) {
                    return "Edit Todo";
                } else {
                    return "Cancel";
                }
            },
        },

        IsEditorHidden: {
            get: function (rec) {
                if (rec("mode") != Enums.todoModes.readOnly) {
                    return false;
                } else {
                    return true;
                }
            },
        },
    },
});
