Ext.define('myApp.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'myApp.shared.Enums'
    ],

    name: 'myApp',
    profiles: ['Phone', 'Desktop'],
    //mainView: 'myApp.view.Main',

    defaultToken: Enums.menuByTags.home,

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
