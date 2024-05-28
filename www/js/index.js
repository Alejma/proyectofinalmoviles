document.addEventListener('deviceready', onDeviceReady, false);

var db;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    db = window.sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, time TEXT)', [], function(tx, res) {
            console.log('Table created successfully');
        }, function(tx, error) {
            console.log('CREATE TABLE error: ' + error.message);
        });
    });

    loadTasks();
}

function loadTasks() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tasks', [], function(tx, resultSet) {
            var list = document.querySelector('#lista');
            list.innerHTML = ''; // Clear current list
            for (var i = 0; i < resultSet.rows.length; i++) {
                var task = resultSet.rows.item(i);
                var newItem = document.createElement('ons-list-item');
                newItem.innerHTML = `
                    <label class="left">
                        <ons-checkbox input-id="check-${task.id}"></ons-checkbox>
                    </label>
                    <label for="check-${task.id}" class="center">
                        ${task.title}
                    </label>
                    <label class="right">
                        <ons-icon icon="ion-ios-trash" data-id="${task.id}"></ons-icon>
                    </label>
                `;
                list.appendChild(newItem);
            }
        }, function(tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.id === 'home') {
        var fabButton = document.getElementById('fab-button');
        fabButton.addEventListener('click', function() {
            document.querySelector('#myNavigator').pushPage('add-tarea.html');
        });

        var taskList = document.getElementById('lista');
        taskList.addEventListener('click', function(event) {
            if (event.target.closest('.ion-ios-trash')) {
                var taskId = event.target.getAttribute('data-id');
                deleteTask(taskId);
                event.target.closest('ons-list-item').remove();
            }
        });

    } else if (page.id === 'add-tarea') {
        var saveButton = page.querySelector('ons-toolbar-button[component="button/save-task"]');
        saveButton.addEventListener('click', function() {
            var titleInput = document.querySelector('#title-input');
            var taskDate = document.querySelector('#taskDate');
            var taskTime = document.querySelector('#taskTime');

            if (titleInput.value) {
                addTask(titleInput.value, taskDate.value, taskTime.value);
                document.querySelector('#myNavigator').popPage();
            } else {
                ons.notification.alert('Por favor ingresa un título para la tarea.');
            }
        });
    }
});

function addTask(title, date, time) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO tasks (title, date, time) VALUES (?, ?, ?)', [title, date, time], function(tx, res) {
            console.log('Task inserted with ID: ' + res.insertId);
            loadTasks();
        }, function(tx, error) {
            console.log('INSERT error: ' + error.message);
        });
    });
}

function deleteTask(id) {
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM tasks WHERE id = ?', [id], function(tx, res) {
            console.log('Task deleted');
        }, function(tx, error) {
            console.log('DELETE error: ' + error.message);
        });
    });
}