Ext.define('myApp.view.desktop.settings.Settings', {
    extend: 'Ext.Panel',

    xtype: 'settings',
    controller: 'settingsController',
    viewModel: 'settingsVM',

    defaultFocus: '[reference=rfFileName]',

    platformConfig: {
        desktop: {
            layout: {
                type: 'hbox',
            },
            header: {
                title: 'Settings',
            },
        },
        '!desktop': {
            layout: {
                type: 'vbox',
                header: {
                    hidden: true,
                },
            }
        }
    },
    bbar: {
        bodyCls: 'settings-bbar',
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: {
            xtype: 'button',
            cls: 'primary-btn',
            text: 'Clear Application Data',
            handler: 'clearAppData'
        }
    },
    items: [
        // Left Panel
        {
            xtype: 'panel',
            cls: 'export-panel-body',
            header: {
                title: 'Export Application Data',
                cls: 'export-header',
                bodyCls: 'export-header-body'
            },
            flex: 1,
            items: [
                // Export Data
                {
                    xtype: 'container',
                    padding: 20,
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'File Name',
                            margin: '30 20 20 20',
                            reference: 'rfFileName',
                            required: true,
                            errorTarget: 'under',
                            requiredMessage: 'Please Enter File Name',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: {
                                xtype: 'button',
                                text: 'Export',
                                cls: 'primary-btn',
                                width: 100,
                                margin: '0 20 0 0',
                                handler: 'exportApplicationData'
                            }
                        }
                    ]
                },
                // Backup server
                {
                    xtype: 'panel',
                    cls: 'export-panel-body',
                    padding: 20,
                    header: {
                        title: 'Server Backup',
                        cls: 'export-header',
                        bodyCls: 'sec-header'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Sync ID',
                            margin: '30 20 20 20',
                            reference: 'rfTxtBackSyncId',
                            value: '',
                            readOnly: true,
                            disabled: true,
                            listeners: {
                                initialize(textField, eOpts) {
                                    var val = commonFunction.readLocalData(Enums.localStorageKeys.userSyncID, true).value || '';
                                    textField.setValue(val);
                                },
                            }

                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Copy Sync ID',
                                    cls: 'primary-btn',
                                    margin: '0 20 0 0',
                                    bind: {
                                        hidden: '{!rfTxtBackSyncId.value}'
                                    },
                                    handler: 'onCopySyncID',
                                },
                                {
                                    xtype: 'button',
                                    text: 'Create SyncID',
                                    cls: 'primary-btn',
                                    margin: '0 20 0 0',
                                    bind: {
                                        hidden: '{rfTxtBackSyncId.value}'
                                    },
                                    handler: 'onCreateSync'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Sync Data',
                                    cls: 'primary-btn',
                                    margin: '0 20 0 0',
                                    bind: {
                                        hidden: '{!rfTxtBackSyncId.value}'
                                    },
                                    handler: 'onSyncUserData'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Clear Sync Data',
                                    cls: 'primary-btn',
                                    margin: '0 20 0 0',
                                    bind: {
                                        hidden: '{!rfTxtBackSyncId.value}'
                                    },
                                    handler: 'onClearSyncData'
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        // Right Panel
        {
            xtype: 'panel',
            header: {
                title: 'Import Application Data',
                cls: 'import-header',
                bodyCls: 'import-header-body'
            },
            flex: 1,
            items: [
                // Import Data
                {
                    xtype: 'container',
                    padding: 20,
                    items: [
                        {
                            xtype: 'filefield',
                            reference: 'rfImportFile',
                            margin: '20',
                            required: true,
                            label: 'Application Data',
                            errorTarget: 'under',
                            requiredMessage: 'Please Select File',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: {
                                xtype: 'button',
                                text: 'Import',
                                margin: '0 20 0 0',
                                width: 100,
                                cls: 'primary-btn',
                                handler: 'importApplicationData'
                            }
                        }
                    ],
                },
                // Restore Data
                {
                    xtype: 'panel',
                    cls: 'export-panel-body',
                    padding: 20,
                    header: {
                        title: 'Restore Data',
                        cls: 'export-header',
                        bodyCls: 'sec-header'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Sync ID',
                            margin: '30 20 20 20',
                            reference: 'rfRestoreSyncID',
                            required: true,
                            errorTarget: 'under',
                            requiredMessage: 'This Sync ID is required',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Restore',
                                    cls: 'primary-btn',
                                    margin: '0 20 0 0',
                                    handler: 'onRestoreSyncData'
                                },
                            ]
                        }
                    ]
                },
            ]
        }
    ],
    listeners: {
        painted: 'onPainted'
    }
});