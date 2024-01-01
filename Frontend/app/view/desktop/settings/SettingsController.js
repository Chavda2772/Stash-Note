Ext.define("myApp.view.desktop.settings.SettingsController", {
    extend: "Ext.app.ViewController",
    requires: ['myApp.view.desktop.syncdata.Syncdata'],

    alias: "controller.settingsController",

    exportApplicationData: function (button) {
        var me = this;
        var namefield = me.getView().lookupReference('rfFileName');
        var exportData = [];
        var localKeys = Object.keys(localStorage).filter((item) => {
            if (Enums.includeToExport.includes(item)) return true;
        });

        if (namefield.validate()) {
            Ext.each(localKeys, function (localKey) {
                exportData.push({
                    keyData: localKey,
                    valueData: commonFunction.readLocalData(localKey, true)
                });
            });
            if (!Ext.Object.isEmpty(exportData)) {
                me.downloadData(namefield.getValue(), JSON.stringify(exportData));
            }
            else {
                Ext.Msg.alert('Error', 'Do not have application data to export.');
            }
        }
        else {
            Ext.toast('Please Enter File Name');
            namefield.focus();
        }

    },
    downloadData: function (fileName, data) {
        try {
            var blob = new Blob([data], { type: "text/json;charset=utf-8" });
            if (!fileName.length < 5) {
                var subChar = fileName.substring(fileName.length - 5);
                if (subChar.toLocaleLowerCase() == '.json') {
                    fileName = fileName.replaceAll(subChar, '')
                }
            }
            saveAs(blob, fileName + '.json');
            Ext.Msg.alert('Success', 'Application Data Successfully Exported ..')
        }
        catch (e) {
            Ext.Msg.alert('Error', e.message);
        }
    },
    onPainted: function () {
        this.getView().focus();
    },
    importApplicationData: function (button) {
        var me = this;
        var fileField = me.getView().lookupReference('rfImportFile');
        var file = fileField.getFiles()[0];
        var reader = new FileReader();

        if (fileField.validate()) {
            if (fileField.getFiles()[0].type != 'application/json') {
                fileField.setErrorMessage("Select valid file to export");
                return true;
            }
            Ext.Msg.confirm('Warning !!!', 'Importing data from file Will remove existing data.</br>Do you want to export data ??', function (choice) {
                if (choice == "yes") {
                    reader.onload = function (fileLoadedEvent) {
                        try {
                            var textFromFileLoaded = fileLoadedEvent.target.result,
                                jsonData = JSON.parse(textFromFileLoaded);

                            me.writeApplicationContent(jsonData);
                        }
                        catch (e) {
                            var erMess = e.message,
                                erName = e.name;

                            if (erName == 'SyntaxError') {
                                fileField.setErrorMessage("Invalid file data to import");
                                return true;
                            }
                            else {
                                fileField.setErrorMessage(erMess);
                            }
                        }
                    };

                    reader.readAsText(file, "UTF-8");
                }
            });
        }
        else {
            fileField.focus();
        }
    },
    writeApplicationContent: function (Records) {
        var me = this;

        Ext.each(Records, function (record) {
            commonFunction.writeLocalData(record.keyData, record.valueData);
        });

        Ext.Msg.alert('Information', 'Data Imported Successfully !!!</br>Reload Application.', function (choice) {
            if (choice == "ok") {
                me.reloadApplication();
            }
        });
    },
    clearAppData: function (button) {
        var me = this;

        Ext.Msg.confirm('Warning !!!', 'Do you want to Delete Application Data .??</br>This Action cannot revert.', function (choice) {
            if (choice == "yes") {
                Enums.includeToExport.forEach(function (localKey) {
                    if (localKey != Enums.localStorageKeys.userSyncID) {
                        commonFunction.deleteLocalData(localKey);
                    }
                });
                Ext.Msg.confirm('Information', 'Your Application Data is removed .</br>Reload Application', function (choice) {
                    if (choice == "yes") {
                        me.reloadApplication();
                    }
                });
            }
        });
    },
    reloadApplication: function (clearHash = true) {
        if (clearHash)
            window.location.hash = "";
        else
            window.location.reload();
    },

    // Database operation
    onCreateSync: function (button) {
        var me = this;
        var view = me.getView();

        var winSync = Ext.create({
            xtype: 'syncdata',
            title: 'Create SyncID',
            listeners: {
                onFormSubmit: function (password) {
                    winSync.setMasked('Loading ...');
                    Proxy.serverSyncProxy.generateSyncData(password,
                        function (resData) {
                            winSync.setMasked(false);
                            // storing unquiID to local store
                            localStorage.setItem(Enums.localStorageKeys.userSyncID, JSON.stringify({ value: resData.uniqueSyncId }));
                            view.lookupReference('rfTxtBackSyncId').setValue(resData.uniqueSyncId);
                            Ext.Msg.alert('Information', "SyncID created successfully.");
                            winSync.close();
                        },
                        function (error) {
                            Ext.Msg.alert('Error', error.message);
                            winSync.setMasked(false);
                            winSync.close();
                        }
                    );
                }
            }
        }).show();
    },
    onCopySyncID() {
        var view = this.getView();
        var txtSyncId = view.lookupReference('rfTxtBackSyncId');

        // Select the text field
        var textArea = document.createElement('textarea');
        textArea.value = txtSyncId.getValue();
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(textArea.value);
        commonFunction.showToast('SyncId copyed successfully')
    },
    onSyncUserData() {
        var me = this;

        var winSync = Ext.create({
            xtype: 'syncdata',
            title: 'Sync user data',
            listeners: {
                onFormSubmit: function (password) {
                    var appLocalData = me.getLocalStorageData();
                    if (!appLocalData) return true;

                    Proxy.serverSyncProxy.syncUserData(
                        commonFunction.readLocalData(Enums.localStorageKeys.userSyncID, true).value,
                        password,
                        appLocalData,
                        function (data) {
                            Ext.Msg.alert('Information', data);
                            winSync.close();
                        },
                        function (error) {
                            Ext.Msg.alert('Error', error.message, (choice) => {
                                winSync.fireEvent('focusPassField', { errorMessage: 'Wrong password !!!' })
                            });
                        }
                    );
                }
            }
        }).show();
    },
    onClearSyncData: function () {
        var me = this;

        Ext.Msg.confirm('Warning !!', 'Clearing sync data also delete data from server and action cannot be revert.<br /> Are you sure you want to clear server data?', (choice) => {

            if (choice != 'yes') return true;

            var winSync = Ext.create({
                xtype: 'syncdata',
                title: 'Clear Sync Data',
                listeners: {
                    onFormSubmit: function (password) {
                        Proxy.serverSyncProxy.clearSyncData(
                            commonFunction.readLocalData(Enums.localStorageKeys.userSyncID, true).value,
                            password,
                            function (data) {
                                Ext.Msg.alert('Information', data);
                                commonFunction.deleteLocalData(Enums.localStorageKeys.userSyncID);
                                me.reloadApplication(false);
                                winSync.close();
                            },
                            function (error) {
                                Ext.Msg.alert('Error', error.message, (choice) => {
                                    winSync.fireEvent('focusPassField', { errorMessage: 'Wrong password !!!' })
                                });
                            }
                        );
                    }
                }
            }).show();
        });
    },
    onRestoreSyncData: function () {
        var me = this;
        var view = me.getView();
        var txtSyncID = view.lookupReference('rfRestoreSyncID');

        if (!txtSyncID.validate()) {
            txtSyncID.focus();
            return true
        };

        // Restore Data
        var winSync = Ext.create({
            xtype: 'syncdata',
            title: 'Sync user data',
            listeners: {
                onFormSubmit: function (password) {
                    Proxy.serverSyncProxy.restoreSyncData(
                        txtSyncID.getValue(),
                        password,
                        function (data) {
                            var userData = JSON.parse(atob(data));
                            if (userData.length) {
                                userData.forEach(function (keyItem) {
                                    commonFunction.writeLocalData(keyItem.keyData, keyItem.valueData)
                                });
                                Ext.Msg.alert('Information', 'Application data imported successfull. <br >Reloading Application.', function (choice) {
                                    me.reloadApplication();
                                });
                            }
                            winSync.close();
                        },
                        function (error) {
                            Ext.Msg.alert('Error', error.message, (choice) => {
                                winSync.fireEvent('focusPassField', { errorMessage: 'Wrong password !!!' })
                            });
                        }
                    );
                }
            }
        }).show();
    },

    // Helper function
    getLocalStorageData: function () {

        try {
            var exportData = [];
            var localKeys = Object.keys(localStorage).filter(item => {
                if (Enums.includeToExport.includes(item)) return true;
            });

            Ext.each(localKeys, function (localKey) {
                exportData.push({
                    keyData: localKey,
                    valueData: commonFunction.readLocalData(localKey, true)
                });
            });

            if (Ext.Object.isEmpty(exportData)) {
                Ext.Msg.alert('Error', 'Error while sync data.');
                return null;
            }

            return btoa(JSON.stringify(exportData));
        } catch (e) {
            Ext.Msg.alert('Error', e.message);
            return null;
        }
    }
});
