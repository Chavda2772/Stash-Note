Ext.define('myApp.view.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loginController',

    routes: {
        'login': 'onLoginRoutes',
        'dashboard': 'onDashboardRoutes'
    },

    listen: {
        global: {
            unmatchedroute: 'onUnmatchedRoute'
        }
    },

    onUnmatchedRoute: function (token) {
        this.redirectTo('login');
    },

    onDashboardRoutes: function () {
        this.getView().destroy();
        Ext.create({
            xtype: 'login'
        });
    },

    onLoginRoutes: function () {
        this.getView().destroy();
        Ext.create({
            xtype: 'login'
        });
    },

    onLogin: function (button) {
        var me = this,
            view = me.getView(),
            formData = view.getValues();

        var username = formData.username,
            password = formData.password;

        view.setMasked("Loading...");

        if (view.validate()) {
            Proxy.user.authenticateUser(username, password, function (data) {
                var authData = data;
                if (!!authData.success) {
                    myApp.defaultSettings = authData.data;
                    view.setMasked(false);
                    view.destroy();
                    localStorage.setItem('authToken', authData.data.Token);
                    Ext.create(Ext.getApplication().getCurrentProfile().getViews()[0]);
                }
                else {
                    view.setMasked(false);
                    Ext.Msg.alert("Error", authData.data.message);
                }
            },
                function (error) {
                    view.setMasked(false);
                    Ext.Msg.alert("Error", error.message);
                }
            );
        }
        else {
            view.setMasked(false);
        }
    },
});