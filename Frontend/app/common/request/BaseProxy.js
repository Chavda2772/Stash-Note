Ext.define('myApp.common.request.BaseProxy', {
    extend: 'Ext.data.proxy.LocalStorage',

    alias: 'proxy.baseProxy',

    //method: 'GET',
    //useDefaultXhrHeader: false,
    //headers: {
    //    "contentType": "application/json; charset=utf-8",
    //    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //},
    //reader: {
    //    reader: 'json'
    //},
});