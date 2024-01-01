Ext.define('myApp.view.phone.main.nav.NavViewController', {
    extend: "Ext.app.ViewController",
    alias: "controller.navviewphcontroller",

    control: {
        '#': {
            viewLoad: 'onViewLoad'
        }
    },

    onViewLoad: function (viewName) {
        this.getViewModel().set('activeMenu', viewName);
    },

    onViewChange: function (button) {
        var me = this,
            view = me.getView();

        if (!!button.ViewType) {
            me.redirectTo(button.ViewType);
            view.getViewModel().set('activeMenu', button.BtnType);
        }
    },
    onAboutUs: function () {
        Ext.create({
            xtype: 'aboutUs',
            width: '90%',
            width: 300,
        }).show()
    }
});
