Ext.define('myApp.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        views: ['myApp.view.phone.Main']
    },

    mainView: 'myApp.view.phone.Main',

    isActive: function () {
        return Ext.os.deviceType == 'Phone';
    },
});