Ext.define('myApp.view.desktop.syncdata.SyncDataController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.syncDataController',

    onSubmitData: function (form, e) {
        var me = this;
        var view = me.getView();
        var txtPass = view.down('#idTxtPassword');

        // Validate
        if (!txtPass.validate()) {
            txtPass.focus();
            return true;
        }

        view.fireEvent('onFormSubmit', txtPass.getValue());
    },

    onFocusPassField: function (config) {
        var me = this;
        var view = me.getView();
        var txtPass = view.down('#idTxtPassword');

        var config = Ext.Object.merge({
            focus: true,
            errorMessage: ''
        }, config);

        if (config.focus) txtPass.focus();

        if (config.errorMessage) txtPass.setErrorMessage(config.errorMessage);
    }

});