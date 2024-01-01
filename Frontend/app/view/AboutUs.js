Ext.define('myApp.view.AboutUs', {
    extend: 'Ext.window.Window',

    xtype: 'aboutUs',

    title: 'About Us',
    scrollable: true,
    layout: 'fit',
    closable: true,

    items: {
        html: `Hello! I'm <a href="/"> Mahesh Chavda</a>, and I work as a software engineer at Knovos India Pvt. Ltd. I've worked on numerous projects during my career and have more than three years of expertise in software engineering.
I recently used Ext JS and local storage to develop a project for my own portfolio. This project serves as a showcase for my software engineering abilities and exemplifies my capacity to develop web apps that are both responsive and user-friendly.
When working on this project, I encountered a number of difficulties, but I was able to overcome them with perseverance and hard work. I'm happy with what I've accomplished so far and eager to advance as a software developer.
I appreciate you visiting my website! Please contact us if you have any queries or would want to get in touch.
`
    },
});