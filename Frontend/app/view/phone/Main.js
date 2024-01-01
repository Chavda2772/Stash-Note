Ext.define('myApp.view.phone.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main-phone',

    fullscreen: true,
    layout: 'hbox',
    items: {
        xtype: 'phoneTodo',
        flex: 1,
    }



    //UnderContruction Design

    //fullscreen: true,
    //cls: 'mainPanel',
    //header: {
    //    titleAlign: 'center',
    //    title: 'under Construction',
    //},
    //bbar: {
    //    items: {
    //        xtype: 'label',
    //        html: 'Thank You for Visit'
    //    }
    //},
    //items: [
    //    {
    //        xtype: 'image',
    //        cls: 'imgConstruction',
    //        src: 'resources/image/underConstruction.gif',
    //        height: 200,
    //        width: 400
    //    },
    //    {
    //        xtype: 'label',
    //        cls: 'contruction',
    //        html: '<h5>Site is under Construction for mobile Devices.<br/ >Please Visit Site From Desktop</h5>'
    //    }
    //]
});
