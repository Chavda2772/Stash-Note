Ext.define('myApp.view.desktop.main.nav.NavView', {
    extend: 'Ext.Toolbar',

    xtype: 'navview',
    controller: "navviewcontroller",
    viewModel: {
        data: {
            activeMenu: Enums.menuItems.home
        }
    },

    layout: 'vbox',
    flex: 1,
    bodyCls: 'navigation-body',
    defaults: {
        xtype: 'button',
        height: 50,
        tooltip: {
            align: 'tr'
        }
    },
    items: [
        {
            iconCls: "x-fa fa-user",
            hidden: true,
            tooltip: {
                html: 'Account'
            }
        },
        '->',
        {
            xtype: 'button',
            iconCls: "x-fa fa-home",
            ViewType: Enums.menuByTags.home,
            BtnType: Enums.menuItems.home,
            handler: 'onViewChange',
            bind: {
                cls: '{activeMenu == "' + Enums.menuByTags.home + '" ? "active-Menu" : ""}',
            },
            tooltip: {
                html: 'home'
            }
        },
        {
            xtype: 'button',
            iconCls: "x-fa fa-cog",
            handler: 'onViewChange',
            BtnType: Enums.menuItems.settings,
            ViewType: Enums.menuByTags.settings,
            bind: {
                cls: '{activeMenu == "' + Enums.menuByTags.settings + '" ? "active-Menu" : ""}',
            },
            tooltip: {
                html: 'Settings'
            }
        },
        '->',
        {
            xtype: 'button',
            iconCls: "x-fa fa-clipboard-list",
            BtnType: Enums.menuItems.about,
            //ViewType: 'about',
            handler: 'onAboutUs',
            bind: {
                cls: '{activeMenu == "' + Enums.menuItems.about + '" ? "active-Menu" : ""}',
            },
            tooltip: {
                html: 'About'
            }
        },
    ],
});
