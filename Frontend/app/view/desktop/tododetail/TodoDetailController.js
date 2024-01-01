Ext.define('myApp.view.desktop.tododetail.TodoDetailController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.tododetailController',

    control: {
        '#': {
            loadDetail: 'loadTodoDetail',
            addTodo: 'onAddTodo',
            todoCountUpdate: 'onTodoCountUpdate'
        }
    },

    onEditorShow: function () {
        tinymce.init({
            selector: 'textarea#todoDescriptionArea',
            body_class: 'tinymceBody',
            plugins: 'link image lists help',
            mobile: {
                plugins: 'link image lists help'
            },
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor permanentpen removeformat | pagebreak | charmap emoticons | preview save print | media template link anchor codesample',
            height: '45vh',
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3',
            toolbar_mode: 'sliding',
            spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
            content_style: '.mymention{ color: gray; }',
            contextmenu: 'link',
        });
    },

    loadTodoDetail: function (todoId) {
        var view = this.getView();
        var vm = view.getViewModel();

        view.setMasked('Loading ...');
        Proxy.todos.getTodoByTodoId(todoId, function (data) {
            var todoDetails = data;

            vm.set(todoDetails);
            vm.set({
                todoId: todoId,
                mode: Enums.todoModes.readOnly,
                firstLoad: false,
            });

            var estDateTime = todoDetails.CompletedBefore.split(" ");
            var todoDate = estDateTime[0];
            var todoTime = estDateTime[1];

            var todoDateSplit = todoDate.split('-');
            var todoTimeSplit = todoTime.split(':');

            vm.set({
                dateEstimation: `${todoDateSplit[2]}/${todoDateSplit[1]}/${todoDateSplit[0]}`,
                timeEstimation: `${todoTimeSplit[0]}:${todoTimeSplit[1]}`
            });

            view.lookupReference('rfTodoTimer').fireEvent('loadDate', todoDetails.CompletedBefore, todoDetails.IsCompleted)
        },
            function (data) {
                Ext.Msg.alert('Error', data.message);
            }
        );

        view.setMasked(false);
    },

    onSave: function (field, event, eOpts) {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            todoId = vm.get().TodoId,
            vmData = vm.get(),
            mode = vm.get('mode'),
            desc = tinyMCE.get('todoDescriptionArea').getContent(),
            form = view.lookupReference('rpTododata');
        var completedBefore = commonFunction.formatDate(vmData.rfDateEstimation.value, vmData.rfTimeEstimation.value);

        view.setMasked('Loading ...');
        if (form.validate()) {

            if (mode == Enums.todoModes.edit) {
                //update Todo Details
                var param = {
                    TodoId: todoId,
                    Title: vmData.Title,
                    Description: desc,
                    IsCompleted: vmData.IsCompleted,
                    //TodoType: vmData.TodoType,
                    //ParentTodo: vmData.ParentTodo,
                    //Level: vmData.Level,
                    CompletedBefore: completedBefore
                };
                Proxy.todos.updateTodoDetail(param, function (data) {
                    view.fireEvent('operationPerformed', param, Enums.todoModes.edit);
                    vm.set('mode', Enums.todoModes.readOnly);
                    Ext.toast('Todo updated successfully.');
                    me.loadTodoDetail(todoId);
                }, function (data) {
                    Ext.Msg.alert('Error', data.message);
                });

            }
            else if (mode == Enums.todoModes.add) {
                //Add Todo
                var vmData = view.getViewModel().get(),
                    formValues = form.getValues(),
                    addTodoId = commonFunction.getTodoId(),
                    isChild = vm.get('ParentId') == 0 ? 0 : 1;

                var param = {
                    //userId: myApp.defaultSettings.ID,
                    TodoId: addTodoId,
                    Title: formValues.todoTitle,
                    Description: desc,
                    IsCompleted: 0,
                    HasChild: 0,
                    ParentId: vm.get('ParentId'),
                    //TodoType: 1,
                    //Level: 0,
                    CompletedBefore: completedBefore,
                    CreatedOn: commonFunction.getcurrentdate(),
                };

                Proxy.todos.addTodo(param, isChild, function (data) {
                    view.fireEvent('operationPerformed', param, Enums.todoModes.add);
                    vm.set('mode', Enums.todoModes.readOnly);
                    Ext.toast('Todo Added successfully.');
                }, function (data) {
                    Ext.Msg.alert('Error', data.message);
                });
            }

        }
        else {
            var invalidfield = form.items.findBy(function (field) {
                if (field.isFocusable()) {
                    return !field.isValid();
                }
            });
            if (invalidfield) {
                Ext.defer(function () {
                    invalidfield.focus();
                }, 2);
            }
        }

        view.setMasked(false);

    },

    onEditheader: function () {
        var me = this,
            view = me.getView(),
            vm = view.getViewModel(),
            mode = vm.get('mode');

        if (mode == Enums.todoModes.readOnly) {
            vm.set('mode', Enums.todoModes.edit);

            if (tinymce.get("todoDescriptionArea")) {
                tinymce.get("todoDescriptionArea").setContent(vm.get('Description'));
            }
            else {
                me.onEditorShow();
                Ext.defer(function () {
                    tinymce.get("todoDescriptionArea").setContent(vm.get('Description'));
                }, 30);
            }
            Ext.defer(function () {
                view.lookupReference('rfEditTitle').focus();
            }, 40);
        }
        else if (mode == Enums.todoModes.add) {
            vm.set('mode', Enums.todoModes.readOnly);
            view.fireEvent('operationPerformed', mode);
        }
        else {
            vm.set('mode', Enums.todoModes.readOnly);
        }

    },

    onAddTodo: function (todoId) {
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();

        var estDate = view.lookupReference('rfDateEstimation'),
            estTime = view.lookupReference('rfTimeEstimation'),
            date = new Date();

        vm.set({
            mode: Enums.todoModes.add,
            Title: '',
            Description: '',
            ParentId: todoId || 0,
        });

        if (!Ext.Object.isEmpty(tinyMCE.get('todoDescriptionArea'))) {
            tinymce.get("todoDescriptionArea").setContent(' ');
        }

        estDate.setValue(`${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`);
        estTime.setValue(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);

        Ext.defer(function () {
            view.lookupReference('rfEditTitle').focus();
        }, 20);

        me.onTodoCountUpdate();
    },

    onBackDetails: function () {
        this.getView().fireEvent('backDetails');
    },

    onCancel: function () {
        this.getViewModel().set('mode', Enums.todoModes.readOnly);
    },

    onDeleteTodo: function (button, e) {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            vmData = vm.getData();

        Ext.Msg.confirm('Warning !!!', 'Are you sure you wan"t to Delete.</br>Action also Delete child todos if Exist and it cannot undo ..???', function (choice) {
            if (choice == "yes") {
                Proxy.todos.deleteTodo(vmData.TodoId, function (data) {
                    if (data) {
                        view.fireEvent('operationPerformed', {
                            TodoId: vmData.TodoId
                        }, Enums.todoModes.delete);
                    }
                }, function (data) {
                    Ext.Msg.alert('Error', data.message);
                });
            }
        });

    },

    addChildTodo: function (button, e) {
        var me = this,
            view = me.getView();

        me.onAddTodo(me.getViewModel().getData().TodoId);
    },

    actionCheckChange: function (checkbox, newValue, oldValue, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        var todoId = vm.get('todoId');

        if (vm.get('firstLoad')) {
            vm.set('firstLoad', false);
        }
        else {
            Proxy.todos.todoCheckChange(todoId, newValue, function (data) {
                me.getView().fireEvent('toggleComplete', newValue);
                me.loadTodoDetail(todoId);
            }, function (data) {
                Ext.Msg.alert(data.message);
            });
        }
    },
    onTodoCountUpdate: function (todoCount) {
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var visible = !todoCount;

        if (todoCount == undefined)
            todoCount = vm.get('todoListCount');

        if (vm.get('mode') == Enums.todoModes.add)
            visible = false;

        view.lookupReference('rfBlankPage').setVisibility(visible);
        vm.set({
            isBlankPageVisible: visible,
            todoListCount: todoCount
        });
    }
});