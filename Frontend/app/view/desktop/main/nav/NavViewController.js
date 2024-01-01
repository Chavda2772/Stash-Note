Ext.define('myApp.view.desktop.main.nav.NavViewController', {
    extend: "Ext.app.ViewController",
    alias: "controller.navviewcontroller",

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
            width: '60%'
        }).show()
    }
});
