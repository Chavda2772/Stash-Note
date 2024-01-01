Ext.define('myApp.view.desktop.timer.TimerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.todoTimerController',

    control: {
        '#': {
            loadDate: 'onLoadDate'
        }
    },

    onLoadDate: function (taskEndDate, IsCompleted) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            status = view.lookupReference('rfTodoStatus');

        var currentDate = new Date(),
            curHours = String(currentDate.getHours()).padStart(2, '0'),
            curMinute = String(currentDate.getMinutes()).padStart(2, '0'),
            curSecond = String(currentDate.getSeconds()).padStart(2, '0');

        //Generate Date
        var startDate = `${currentDate.getDate()} ${Enums.monthById[currentDate.getMonth()]} ${currentDate.getFullYear()} ${curHours}:${curMinute}:${curSecond} UTC+05:30`;

        vm.set(commonFunction.dateDifference(startDate, taskEndDate));
        vm.set('IsCompleted', IsCompleted);
        
        clearInterval(me.timer);
        me.startTimer();
    },

    startTimer: function () {
        var me = this;
        var vm = me.getView().getViewModel();
        var days = vm.get('days');
        var hours = vm.get('hours');
        var minutes = vm.get('minutes');
        var seconds = vm.get('seconds');
        var IsCompleted = vm.get('IsCompleted');

        me.timer = setInterval(function () {
            if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
                clearInterval(me.timer);
                if (!IsCompleted) {
                    Ext.toast("Estimated Time is Due for current Task.");
                }
            }
            else {
                if (seconds <= 0) {
                    if (minutes <= 0) {
                        if (hours <= 0) {
                            if (days != 0) {
                                days = days - 1;
                                hours = 23;
                                minutes = 59;
                                seconds = 59;
                            }
                        }
                        else {
                            hours = hours - 1;
                            minutes = 59;
                            seconds = 59;
                        }
                    }
                    else {
                        minutes = minutes - 1;
                        seconds = 59;
                    }
                }
                else {
                    seconds = seconds - 1;
                }
            }

            vm.set({
                minutes: minutes,
                seconds: seconds,
                hours: hours,
                days: days
            });

        }, 1000)
    }
});