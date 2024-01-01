Ext.define('myApp.model.TodoTreeListModel', {
    extend: 'Ext.data.Model',
    fields:
        [
            {
                name: 'Title',
            },
            {
                name: 'leaf',
                convert: function (value, rec) {
                    if (!rec.get('root')) {
                        return rec.get('HasChild') == 0;
                    }
                    else {
                        return false;
                    }
                },
            },
            {
                name: 'iconCls',
                convert: function (value, rec) {
                    if (!rec.get('root') && !!rec.get('HasChild')) {
                        return 'x-fa fa-folder';
                    }
                    else {
                        return 'x-fa fa-file-alt';
                    }
                },
            },
            {
                name: 'HasChild',
            },
            {
                name: 'IsCompleted',
            },
            {
                name: 'checked',
                convert: function (value, rec) {
                    if (!rec.get('root')) {
                        return rec.get("IsCompleted") ? true : false;
                    }
                },
                depends: ['IsCompleted'],
            },
        ],
});