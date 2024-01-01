Ext.define('myApp.view.Main', {
    extend: 'Ext.form.Panel',

    xtype: 'login',
    controller: 'loginController',

    title: 'Login Page',
    fullscreen: true,
    defaults: {
        style: 'margin: 30px 60px',
    },
    buttons: {
        save: {
            text: 'Login',
            handler: 'onLogin',
        }
    },
    defaults: {
        xtype: 'textfield',
        errorTarget: 'under',
        required: true,
    },
    items: [
        {
            label: 'UserName',
            name: 'username',
            requiredMessage: 'UserName is Required.'
        },
        {
            label: 'Password',
            name: 'password',
            inputType: 'password',
            requiredMessage: 'Password is Required.'
        },
    ],
    listeners: {
        //painted: 'onLogin'
    }
});
