Ext.define('myApp.view.desktop.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainDesktopController',

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    onUnmatchedRoute: function (token) {
        var me = this,
            view = me.getView(),
            menus = Enums.menuByTags,
            contentView = view.lookupReference('rfMainView'),
            navMenu = view.lookupReference('rfNavMenu'),
            loadView = {};

        Object.values(menus).forEach(function (menu) {
            if (token == menu) {
                loadView.name = menu;
            }
        });

        if (!loadView.name) {
            me.redirectTo(menus[Object.keys(menus)[0]]);
            return true;
        }

        navMenu.fireEvent('viewLoad', loadView.name);
        contentView.setItems({ xtype: loadView.name });
    },
    //routes: { 
    //	//':xtype': {
    //	//	action: 'mainRoute'
    //	//}
    //},

    //mainRoute:function(xtype) {
    //	var menuview = this.lookup('menuview');
    //	var me = this,
    //		view = me.getView(),
    //		vm = me.getViewModel();

    //	var navview = me.lookup('navview');
    //	var menuview = navview.items.items[0]

    //	var centerview = me.lookup('centerview');
    //	var exists = Ext.ClassManager.getByAlias('widget.' + xtype);
    //	if (exists === undefined) {
    //		console.log(xtype + ' does not exist');
    //		return;
    //	}

    //	var node = menuview.getStore().findNode('xtype', xtype);

    //	if (node == null) {
    //		console.log('unmatchedRoute: ' + xtype);
    //		return;
    //	}

    //	if (!centerview.getComponent(xtype)) {
    //		centerview.add({ xtype: xtype,  itemId: xtype, heading: node.get('text') });
    //	}

    //	centerview.setActiveItem(xtype);
    //	menuview.setSelection(node);
    //	var vm = me.getViewModel(); 

    //	vm.set('heading', node.get('text'));
    //},

    //onMenuViewSelectionChange: function (tree, node) {
    //	if (node == null)
    //	{
    //		return
    //	}

    //	var vm = this.getViewModel();
    //	if (node.get('xtype') != undefined) {
    //		this.redirectTo( node.get('xtype') );
    //	}
    //},

    //onTopViewNavToggle: function () {
    //	var vm = this.getViewModel();
    //	vm.set('navCollapsed', !vm.get('navCollapsed'));
    //},

    //onHeaderViewDetailToggle: function (button) {
    //	var vm = this.getViewModel();

    //	vm.set('detailCollapsed', !vm.get('detailCollapsed'));

    //	if(vm.get('detailCollapsed')===true) {
    //		button.setIconCls('x-fa fa-arrow-left');
    //	}
    //	else {
    //		button.setIconCls('x-fa fa-arrow-right');
    //	}
    //},

    //onBottomViewlogout: function () {
    //	localStorage.setItem("LoggedIn", false);
    //	this.getView().destroy();
    //	Ext.Viewport.add([{ xtype: 'loginview'}]);
    //},


    //	onActionsViewLogoutTap: function( ) {
    //		var vm = this.getViewModel();
    //		vm.set('firstname', '');
    //		vm.set('lastname', '');
    //
    //		Session.logout(this.getView());
    //		this.redirectTo(AppCamp.getApplication().getDefaultToken().toString(), true);
    //	}

});
