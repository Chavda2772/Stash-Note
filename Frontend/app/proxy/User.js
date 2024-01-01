Ext.define('myApp.proxy.User', {
    alternateClassName: 'Proxy.user',
    singleton: true,

    authenticateUser: function (userName, password, success, error) {

        return Common.request.call({
            url: ApiMethods.login,
            method: 'GET',
            params: {
                userName: userName,
                password: password
            },
            success: success,
            error: error
        });
    },

});