Ext.define('myApp.view.phone.main.nav.NavViewPh', {
    extend: 'Ext.Toolbar',

    requires: ['Ext.Toolbar'],

    xtype: 'navviewph',
    controller: "navviewphcontroller",
    viewModel: {
        data: {
            activeMenu: Enums.menuByTags.home
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
            BtnType: Enums.menuByTags.home,
            ViewType: Enums.mobileViews.todoList,
            handler: 'onViewChange',
            bind: {
                cls: '{activeMenu == "' + Enums.mobileViews.todoList + '" ? "active-Menu" : ""}',
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
            ViewType: Enums.mobileViews.settings,
            bind: {
                cls: '{activeMenu == "' + Enums.mobileViews.settings + '" ? "active-Menu" : ""}',
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
