Ext.define('myApp.proxy.ServerSyncProxy', {
    alternateClassName: 'Proxy.serverSyncProxy',
    singleton: true,

    generateSyncData: function (password, success, error) {

        return Common.request.call({
            url: ApiMethods.generateSyncId,
            method: 'POST',
            params: {
                password: password
            },
            success: success,
            error: error
        });
    },
    syncUserData: function (uniqueSyncId, password, data, success, error) {
        return Common.request.call({
            url: ApiMethods.syncUserData,
            method: 'POST',
            params: {
                uniqueSyncId,
                password,
                data
            },
            success: success,
            error: error
        });
    },
    clearSyncData: function (uniqueSyncId, password, success, error) {
        return Common.request.call({
            url: ApiMethods.clearSyncData,
            method: 'POST',
            params: {
                uniqueSyncId,
                password
            },
            success: success,
            error: error
        });
    },
    restoreSyncData: function (uniqueSyncId, password, success, error) {
        return Common.request.call({
            url: ApiMethods.restoreSyncData,
            method: 'POST',
            params: {
                uniqueSyncId,
                password
            },
            success: success,
            error: error
        });
    },
    validateUser: function (uniqueSyncId, success, error) {
        return Common.request.call({
            url: ApiMethods.validate,
            method: 'POST',
            params: {
                uniqueSyncId,
            },
            success: success,
            error: error
        });
    },
});