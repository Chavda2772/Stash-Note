Ext.define('myApp.shared.Common', {
    alternateClassName: 'commonFunction',
    singleton: true,

    getcurrentdate: function () {
        return this.formatDate(new Date(), new Date());
    },

    formatDate: function (date, time) {
        //2021-05-16 11:01:00
        var estDate = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();

        var hours = String(time.getHours()).padStart(2, '0');
        var minits = String(time.getMinutes()).padStart(2, '0');
        var second = String(time.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${estDate} ${hours}:${minits}:${second}`;
    },

    dateDifference: function (startDate, endDate) {
        var dayMilli = 1000 * 60 * 60 * 24;
        var hoursMilli = 1000 * 60 * 60;
        var minutesMilli = 1000 * 60;
        var secondsMilli = 1000;

        var RemainDays = 0;
        var RemainHours = 0;
        var RemainMinutes = 0;
        var RemainSeconds = 0;

        var totalRemainMilli = new Date(endDate) - new Date(startDate);

        var timeIsMoreThanDay = totalRemainMilli - dayMilli;
        if (Math.sign(timeIsMoreThanDay) == 1 || Math.sign(timeIsMoreThanDay) == 0) {
            var RemainDays = Math.floor(totalRemainMilli / dayMilli);
            totalRemainMilli = totalRemainMilli - (dayMilli * RemainDays);
        }

        var timeIsMoreThanHour = totalRemainMilli - hoursMilli;
        if (Math.sign(timeIsMoreThanHour) == 1 || Math.sign(timeIsMoreThanHour) == 0) {
            RemainHours = Math.floor(totalRemainMilli / hoursMilli);
            totalRemainMilli = totalRemainMilli - (hoursMilli * RemainHours);
        }

        var timeIsMoreThanMinute = totalRemainMilli - minutesMilli;
        if (Math.sign(timeIsMoreThanMinute) == 1 || Math.sign(timeIsMoreThanMinute) == 0) {
            RemainMinutes = Math.floor(totalRemainMilli / minutesMilli);
            totalRemainMilli = totalRemainMilli - (minutesMilli * RemainMinutes);
        }

        var timeIsMoreThanSecond = totalRemainMilli / secondsMilli;
        if (Math.sign(timeIsMoreThanSecond) == 1 || Math.sign(timeIsMoreThanSecond) == 0) {
            RemainSeconds = Math.floor(totalRemainMilli / secondsMilli);
        }

        return {
            days: RemainDays,
            hours: RemainHours,
            minutes: RemainMinutes,
            seconds: RemainSeconds
        }
    },

    stringSizeValid: function (string) {
        return new Blob([string]).size < 38400;
    },

    readLocalData: function (dataKey, isJson = true) {
        var fetchData = localStorage.getItem(dataKey);
        var rtnData = '';

        if (!Ext.Object.isEmpty(fetchData)) {
            if (isJson) {
                try {
                    rtnData = JSON.parse(fetchData)
                } catch (error) {
                    console.error(error);
                    rtnData = fetchData;
                }
            }
            else {
                rtnData = fetchData;
            }
        }
        return rtnData;
    },

    deleteLocalData: function (dataKey) {
        if (localStorage.getItem(dataKey)) localStorage.removeItem(dataKey);
    },

    writeLocalData: function (dataKey, data, isJson = true) {
        if (isJson) {
            localStorage.setItem(dataKey, JSON.stringify(data));
        }
        else {
            localStorage.setItem(dataKey, data);
        }

        return !!localStorage.getItem(dataKey);
    },

    getTodoId: function () {
        return parseInt(localStorage.getItem(Enums.localStorageKeys.nextTodoID)) || 1;
    },

    updateField: function (dataKey, itemId, field, newValue) {
        var me = this,
            keyDatas = me.readLocalData(dataKey, true);

        Ext.each(keyDatas, function (record) {
            if (record.TodoId == itemId) {
                record[field] = newValue;
            }
        });

        return me.writeLocalData(dataKey, keyDatas, true);
    },

    incrementNextTodoId: function () {
        var me = this;
        me.writeLocalData(Enums.localStorageKeys.nextTodoID, me.getTodoId() + 1, false)
    },

    deleteSubChilds: function (dataArray, todoId) {
        var children = [],
            newItemArray = dataArray;

        //fetch all childs
        newItemArray.forEach(function (item) {
            if (item.ParentId == todoId) {
                children.push(item);
            }
        });

        //loop to all childs
        if (!!children.length) {
            children.forEach(function (child) {
                //if Haschild property is 0 Remove node
                if (child.HasChild == 0) {
                    newItemArray = newItemArray.filter(function (item) {
                        return child.TodoId != item.TodoId;
                    });
                }
                //else remove child elements and then remove item
                else {
                    newItemArray = commonFunction.deleteSubChilds(newItemArray, child.TodoId);
                    newItemArray = newItemArray.filter(function (item) {
                        return child.TodoId != item.TodoId;
                    });
                }
            });
        }

        //Return List of the new nodes
        return newItemArray;
    },

    showToast: function (message, timeout = 2000) {
        Ext.toast({
            message: message,
            timeout: timeout
        })
    }
});