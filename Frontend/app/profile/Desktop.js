Ext.define('myApp.profile.Desktop', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Desktop',
        views: ['myApp.view.desktop.Main']
    },

    mainView: 'myApp.view.desktop.Main',

    isActive: function () {
        return Ext.os.deviceType = 'Desktop';
    },
});