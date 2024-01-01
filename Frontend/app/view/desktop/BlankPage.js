Ext.define("myApp.view.desktop.BlankPage", {
    extend: "Ext.Panel",

    xtype: 'blankPage',
    scrollable: false,
    layout: 'fit',
    fullscreen: true,
    viewModel: {},

    eventedConfig: {
        visibility: true
    },

    items: {
        xtype: 'img',
        style: {
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            margin: '1rem 10rem'
        },
        src: 'resources/image/blankpage_add_tasks.svg',
    },
    listeners: {
        visibilitychange: function (instance, newValue, oldValue) {
            this.setHidden(!newValue);
        }
    }
});