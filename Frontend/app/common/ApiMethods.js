Ext.define('myApp.common.ApiMethods', {
    alternateClassName: 'ApiMethods',
    singleton: true,

    baseURL: "",

    // DataSync
    generateSyncId: '/api/generateNewSync',
    syncUserData: '/api/syncUserData',
    clearSyncData: '/api/clearSyncData',
    restoreSyncData: '/api/restoreSyncData',
    validate: '/api/validate',

},
    function () {
        if (Ext.manifest.mode == 'development')
            this.baseURL = "http://localhost:3000";        
    }
);
