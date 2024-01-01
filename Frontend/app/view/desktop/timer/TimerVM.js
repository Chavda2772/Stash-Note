Ext.define('myApp.view.desktop.timer.TimerVM', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.timerVM',

    data: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        IsCompleted: 0
    },

    formulas: {
        getTimerColor: {
            get: function (rec) {
                var hours = rec('hours'),
                    minutes = rec('minutes');

                if (hours == 0 && minutes < 10) {
                    return Enums.timerColors.red;
                }
                else if (hours == 0 && minutes < 30) {
                    return Enums.timerColors.yellow;
                }
                else {
                    return Enums.timerColors.green;
                }
            },
        },
    },
});
