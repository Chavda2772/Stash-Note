Ext.define('myApp.view.desktop.timer.Timer', {
    extend: 'Ext.Toolbar',

    xtype: 'todoTimer',
    controller: 'todoTimerController',
    viewModel: 'timerVM',

    bodyCls: 'timer-toolbar',

    platformConfig: {
        desktop: {
            layout: 'hbox',
        },

        '!desktop': {
            layout: 'vbox',
        }
    },
    items: [
        {
            xtype: 'label',
            reference: 'rfTodoStatus',
            alignSelf: 'center',
            bind: {
                style: {
                    color: '{IsCompleted == 1 ? "' + Enums.timerColors.green + '" : "' + Enums.timerColors.red + '"}'
                },
                html: '{IsCompleted == 1 ? "Completed" : "Not Completed"}',
            },
        },
        '->',
        {
            xtype: 'container',
            reference: 'rfDetailTimer',
            layout: 'hbox',
            bind: {
                hidden: '{IsCompleted}'
            },
            defaults: {
                xtype: 'label',
                alignSelf: 'center',
            },
            items: [
                {
                    platformConfig: {
                        desktop: {
                            html: '<pre>Remaining Time: </pre>'
                        },

                        '!desktop': {
                            html: '<pre>Time: </pre>'
                        }
                    },
                },
                {
                    bind: {
                        style: 'color: {getTimerColor}',
                    },
                    platformConfig: {
                        desktop: {
                            bind: {
                                html: '<pre>{days} days,</pre>',
                                hidden: '{days == 0}'
                            }
                        },

                        '!desktop': {
                            bind: {
                                html: '<pre>{days} D,</pre>',
                                hidden: '{days == 0}'
                            }
                        }
                    },
                },
                {
                    bind: {
                        style: 'color: {getTimerColor}',
                    },
                    platformConfig: {
                        desktop: {
                            bind: {
                                html: '<pre> {hours} hours,</pre>',
                                hidden: '{days == 0 && hours == 0}'
                            }
                        },

                        '!desktop': {
                            bind: {
                                html: '<pre> {hours} H,</pre>',
                                hidden: '{days == 0 && hours == 0}'
                            }
                        }
                    },
                },
                {
                    bind: {
                        style: 'color: {getTimerColor}',
                    },
                    platformConfig: {
                        desktop: {
                            bind: {
                                html: '<pre> {minutes} minutes,</pre>',
                                hidden: '{days == 0 && hours == 0 && minutes == 0}'
                            }
                        },

                        '!desktop': {
                            bind: {
                                html: '<pre> {minutes} M,</pre>',
                                hidden: '{days == 0 && hours == 0 && minutes == 0}'
                            }
                        }
                    },
                },
                {
                    bind: {
                        style: 'color: {getTimerColor}',
                    },
                    platformConfig: {
                        desktop: {
                            bind: {
                                html: '<pre> {seconds} seconds</pre>'
                            }
                        },

                        '!desktop': {
                            bind: {
                                html: '<pre> {seconds} S</pre>'
                            }
                        }
                    },
                }
            ]
        }
    ]

});