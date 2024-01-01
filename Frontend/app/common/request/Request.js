Ext.define('myApp.common.request.Request', {
    alternateClassName: 'Common.request',
    singleton: true,

    requires: ['myApp.common.ApiMethods'],

    call: function (options) {
        // Extra config
        //options.parseData = options.parseData ?? true;
        options.parseData = options.parseData !== null && options.parseData !== void 0 ? options.parseData : true;

        options.url = ApiMethods.baseURL + options.url;
        options.useDefaultXhrHeader = false;

        options.method = options.method || "GET";
        //options.async = options.async ?? true;
        options.async = options.async !== null && options.async !== void 0 ? options.async : true;
        options.timeout = options.timeout !== null && options.timeout !== void 0 ? options.timeout : 30000;
        options.suppressError = options.suppressError || false;
        options.headers = {
            "contentType": options.contentType || "application/json; charset=utf-8",
            'Authorization': `Bearer ${localStorage.getItem('authToken') || "Mahesh Chavda"}`
        };
        var request = {
            url: options.url,
            async: options.async,
            method: options.method,
            scope: this,
            defaultHeaders: options.headers,
            callback: function (opt, success, response) {
                var resReturnSuccess = true;

                // If Required raw data make this false
                if (options.parseData && !!response.responseText && success) {
                    responseValue = JSON.parse(response.responseText);

                    // If success is true then only proxy is success else error
                    if (responseValue.success)
                        responseValue = responseValue.details;
                    else {
                        delete responseValue.success;
                        resReturnSuccess = false;
                    }

                }
                else {
                    responseValue = response.responseText;

                    // When server is down and response not recived
                    if (response.status == 0 && !responseValue) {
                        if (options.parseData)
                            responseValue = { message: 'Server response not received.' }
                        else
                            responseValue = 'Server response not received.';
                    }
                }

                if (success && resReturnSuccess) {
                    if (options.success) {
                        options.success.apply(options.scope, [responseValue]);
                    }
                }
                else if (options.error) {
                    options.error.apply(options.scope, [responseValue]);
                }
            }
        };

        if (options.formData) {
            request.data = options.formData;
        }
        else if (options.method === "GET") {
            request.params = options.params;
        }
        else {
            request.jsonData = options.params;
        }

        var responseValue = null;
        Ext.Ajax.request(request);
        return responseValue;

    }
});