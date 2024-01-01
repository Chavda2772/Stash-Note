Ext.define('myApp.view.desktop.syncdata.Syncdata', {
    extend: 'Ext.form.Panel',
    requires: ['myApp.view.desktop.syncdata.SyncDataController'],

    alias: ['widget.syncdata'],
    controller: 'syncDataController',
    viewModel: {
        data: {
            isPassVisible: false,
        }
    },

    floated: true,
    modal: true,
    centered: true,
    closable: true,
    width: 500,
    padding: '10 20',
    title: 'Sync user data',

    layout: {
        type: 'hbox',
        pack: 'end'
    },
    bbar: {
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: [
            {
                xtype: 'button',
                text: 'Submit',
                handler: 'onSubmitData'
            }
        ]
    },
    items: [
        {
            xtype: 'passwordfield',
            name: 'password',
            itemId: 'idTxtPassword',
            label: 'Password',
            revealable: true,
            required: true,
            revealed: false,
            errorTarget: 'under',
            requiredMessage: 'Password is required',
            flex: 1,
        }
    ],
    listeners: {
        focusPassField: 'onFocusPassField'
	}
});                        