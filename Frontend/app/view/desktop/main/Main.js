Ext.define('myApp.view.desktop.Main', {
    extend: 'Ext.Panel',

    requires: [
        'myApp.view.desktop.todo.Todo',
        'myApp.view.desktop.settings.Settings',
        'myApp.view.desktop.main.MainController',
        'myApp.view.desktop.main.MainVM',
        'myApp.view.desktop.main.nav.NavView'
    ],

    xtype: 'mainDesktop',
    controller: 'mainDesktopController',
    viewModel: 'mainDesktopVM',

    fullscreen: true,
    layout: 'hbox',
    items: [
        {
            xtype: 'navview',
            reference: 'rfNavMenu',
            maxWidth: 45,
            padding: 0,
        },
        {
            xtype: 'container',
            reference: 'rfMainView',
            defaults: {
                fullscreen: true
            },
            flex: 1
        },
    ]

});