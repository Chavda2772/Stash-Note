Ext.define('myApp.common.ApiMethods', {
    alternateClassName: 'ApiMethods',
    singleton: true,

    baseURL: "",

    // DataSync
    generateSyncId: '/api/generateNewSync',
    syncUserData: '/api/syncUserData',
    clearSyncData: '/api/clearSyncData',
    restoreSyncData: '/api/restoreSyncData',

},
    function () {
        if (Ext.manifest.mode == 'development')
            this.baseURL = "http://localhost:3000"

        console.log("Application Mode:", Ext.manifest.mode)
    }
);
