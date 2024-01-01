Ext.define("myApp.view.desktop.tododetail.TodoDetail", {
    extend: "Ext.Panel",

    requires: [
        'Ext.Toolbar',
        'Ext.Label',
        'myApp.view.desktop.timer.Timer', ,
        'myApp.view.desktop.BlankPage'
    ],

    xtype: "todoDetail",
    controller: "tododetailController",
    viewModel: {
        type: 'todoDetailVM'
    },

    defaultFocus: '[reference=rfEditTitle]',
    scrollable: true,
    tbar: {
        shadow: false,
        bodyCls: 'todo-details-action-toolbar',
        bind: {
            hidden: '{isBlankPageVisible}',
        },
        defaults: {
            xtype: 'button',
        },
        items: [
            {
                iconCls: 'x-fa fa-arrow-left',
                handler: 'onBackDetails',
                platformConfig: {
                    desktop: {
                        hidden: true
                    },
                    '!desktop': {
                        hidden: false
                    }
                }
            },
            {
                iconCls: 'x-fa fa-plus',
                tooltip: 'Add child',
                handler: 'addChildTodo',
                bind: {
                    hidden: '{mode == "' + Enums.todoModes.add + '"}'
                }
            },
            {
                xtype: 'checkboxfield',
                name: 'topping',
                bind: {
                    checked: '{IsCompleted}',
                    tooltip: '{IsCompleted ? "Mark as Not Complete" : "Mark as Complete"}',
                    hidden: '{mode == "' + Enums.todoModes.add + '"}'
                },
                listeners: {
                    change: 'actionCheckChange'
                },
            },
            {
                bind: {
                    tooltip: '{addEditButtonTooltip}',
                    iconCls: '{addEditButtonCls}',
                },
                handler: 'onEditheader',
            },
            {
                iconCls: 'x-fa fa-trash-alt',
                tooltip: 'Delete',
                handler: 'onDeleteTodo',
                bind: {
                    hidden: '{mode == "' + Enums.todoModes.add + '"}'
                }
            },
            {
                xtype: 'label',
                margin: '0 0 0 10',
                bind: {
                    html: '{Title}',
                },
            }
        ]
    },
    bbar: {
        bind: {
            hidden: '{isBlankPageVisible}',
        },
        padding: '0',
        shadow: false,
        layout: {
            type: 'hbox',
            align: 'stretch',
        },
        items: [
            {
                //Timer when not in edit mode
                xtype: 'todoTimer',
                flex: 1,
                reference: 'rfTodoTimer',
                cls: 'todo-details-btom-toolbar',
                bind: {
                    hidden: '{!IsEditorHidden}'
                },
            },
            {
                //Bottom on edit mode
                xtype: 'toolbar',
                reference: 'rfbuttons',
                flex: 1,
                bodyCls: 'todo-details-btom-toolbar',
                bind: {
                    hidden: '{IsEditorHidden}'
                },
                items: [
                    '->',
                    {
                        xtype: 'button',
                        cls: 'add-todo-button',
                        bind: {
                            text: '{mode == "' + Enums.todoModes.add + '" ? "Add" : "Save"}',
                        },
                        handler: 'onSave',
                    },
                    {
                        xtype: 'button',
                        cls: 'add-todo-button',
                        text: 'Cancel',
                        margin: '0 0 0 10',
                        handler: 'onCancel',
                    }
                ]
            },
        ],
    },


    items: [
        {
            // Blank page
            xtype: 'blankPage',
            reference: 'rfBlankPage'
        },
        {
            //Main panel all controls
            xtype: 'formpanel',
            reference: 'rpTododata',
            defaults: {
                errorTarget: 'under'
            },
            bind: {
                hidden: '{isBlankPageVisible}',
            },
            items: [
                {
                    xtype: 'textfield',
                    reference: "rfEditTitle",
                    label: "Title",
                    name: "todoTitle",
                    cls: 'todoDetailstitle',
                    required: true,
                    requiredMessage: 'Todo Title is required',
                    bind: {
                        hidden: '{mode == "' + Enums.todoModes.readOnly + '"}',
                        value: '{Title}',
                    },
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    bind: {
                        hidden: '{IsEditorHidden}',
                    },
                    items: [
                        {
                            xtype: 'datefield',
                            reference: 'rfDateEstimation',
                            label: 'Estimated Date',
                            dateFormat: 'd/m/Y',
                            name: 'estimateData',
                            required: true,
                            cls: 'todoDetailstitle',
                            requiredMessage: 'Date field is required',
                            flex: 1,
                            bind: {
                                hidden: '{IsEditorHidden}',
                                value: '{dateEstimation}'
                            }
                        },
                        {
                            xtype: 'timefield',
                            reference: 'rfTimeEstimation',
                            label: 'Time',
                            cls: 'todoDetailstitle',
                            name: 'estimateTime',
                            required: true,
                            requiredMessage: 'Time field is required',
                            flex: 1,
                            bind: {
                                hidden: '{IsEditorHidden}',
                                value: '{timeEstimation}'
                            }
                        },
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Description',
                    cls: 'todoDetailstitle',
                    bind: {
                        hidden: '{IsEditorHidden}'
                    },
                    style: 'padding: 10px 20px',
                    items: [
                        {
                            xtype: 'label',
                            html: '<textarea id="todoDescriptionArea"></textarea>',
                            listeners: {
                                painted: 'onEditorShow',
                            },
                        },
                    ]
                },
                {
                    xtype: 'label',
                    style: 'padding: 10px 20px;font-size: 15px;overflow-wrap: break-word;word- wrap: break-word;hyphens: auto;',
                    bind: {
                        html: '{Description}',
                        hidden: "{!IsEditorHidden}",
                    },
                },
            ]
        },
    ],
});