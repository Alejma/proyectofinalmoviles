document.addEventListener('deviceready', onDeviceReady, false);

var db;

function onDeviceReady() {
    console.log('Cordova is now initialized.');
    db = window.sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, time TEXT)', [], function(tx, res) {
            console.log('Table created successfully');
        }, function(tx, error) {
            console.log('CREATE TABLE error: ' + error.message);
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, content TEXT, FOREIGN KEY(task_id) REFERENCES tasks(id))', [], function(tx, res) {
            console.log('Notes table created successfully');
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
                newItem.setAttribute('data-id', task.id);
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

                // Añadir evento de clic solo al área central para abrir la página de detalles
                var centerLabel = newItem.querySelector('.center');
                centerLabel.addEventListener('click', (function(taskId) {
                    return function(event) {
                        document.querySelector('#myNavigator').pushPage('detalles-tarea.html', {data: {taskId: taskId}});
                    };
                })(task.id));

                // Añadir evento de clic al icono de basura para eliminar la tarea
                var trashIcon = newItem.querySelector('.right ons-icon');
                trashIcon.addEventListener('click', (function(taskId, item) {
                    return function(event) {
                        event.stopPropagation(); // Prevenir que el clic en el icono de basura también active el evento del área central
                        deleteTask(taskId, item);
                    };
                })(task.id, newItem));
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
    } else if (page.id === 'detalles-tarea') {
        var taskId = page.data.taskId;

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM tasks WHERE id = ?', [taskId], function(tx, resultSet) {
                if (resultSet.rows.length > 0) {
                    var task = resultSet.rows.item(0);
                    document.querySelector('#title-input').value = task.title;
                    document.querySelector('#taskDate').value = task.date;
                    document.querySelector('#taskTime').value = task.time;
                }
            });

            tx.executeSql('SELECT * FROM notes WHERE task_id = ?', [taskId], function(tx, resultSet) {
                var notesList = document.querySelector('#notes-list');
                notesList.innerHTML = ''; // Clear current notes list
                for (var i = 0; i < resultSet.rows.length; i++) {
                    var note = resultSet.rows.item(i);
                    var noteItem = document.createElement('ons-list-item');
                    noteItem.setAttribute('data-id', note.id);
                    noteItem.innerHTML = `
                        ${note.content}
                        <div class="right">
                            <ons-icon icon="ion-ios-trash" data-id="${note.id}"></ons-icon>
                        </div>
                    `;
                    notesList.appendChild(noteItem);

                    var trashIcon = noteItem.querySelector('.right ons-icon');
                    trashIcon.addEventListener('click', (function(noteId, item) {
                        return function(event) {
                            event.stopPropagation();
                            deleteNote(noteId, item);
                        };
                    })(note.id, noteItem));
                }
            });
        });

        var saveButton = page.querySelector('ons-toolbar-button[component="button/save-task"]');
        saveButton.addEventListener('click', function() {
            var titleInput = document.querySelector('#title-input').value;
            var taskDate = document.querySelector('#taskDate').value;
            var taskTime = document.querySelector('#taskTime').value;

            updateTask(taskId, titleInput, taskDate, taskTime);
            document.querySelector('#myNavigator').popPage();
        });

        var addNoteButton = page.querySelector('#add-note-button');
        addNoteButton.addEventListener('click', function() {
            var noteInput = document.querySelector('#note-input').value;
            if (noteInput) {
                addNote(taskId, noteInput);
                document.querySelector('#note-input').value = ''; // Clear input after adding note
            }
        });
    }
});

function addTask(title, date, time) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO tasks (title, date, time) VALUES (?, ?, ?)', [title, date, time], function(tx, res) {
            console.log('Task inserted with ID: ' + res.insertId);
            loadTasks(); // Recargar las tareas después de agregar una nueva
        }, function(tx, error) {
            console.log('INSERT error: ' + error.message);
        });
    });
}

function updateTask(id, title, date, time) {
    db.transaction(function(tx) {
        tx.executeSql('UPDATE tasks SET title = ?, date = ?, time = ? WHERE id = ?', [title, date, time, id], function(tx, res) {
            console.log('Task updated');
            loadTasks(); // Recargar las tareas después de actualizar una tarea
        }, function(tx, error) {
            console.log('UPDATE error: ' + error.message);
        });
    });
}

function deleteTask(id, item) {
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM tasks WHERE id = ?', [id], function(tx, res) {
            console.log('Task deleted');
            item.remove(); // Eliminar el elemento de la lista de tareas
        }, function(tx, error) {
            console.log('DELETE error: ' + error.message);
        });
    });
}

function addNote(taskId, content) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO notes (task_id, content) VALUES (?, ?)', [taskId, content], function(tx, res) {
            console.log('Note inserted with ID: ' + res.insertId);
            loadNotes(taskId); // Recargar las notas después de agregar una nueva
        }, function(tx, error) {
            console.log('INSERT error: ' + error.message);
        });
    });
}

function loadNotes(taskId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM notes WHERE task_id = ?', [taskId], function(tx, resultSet) {
            var notesList = document.querySelector('#notes-list');
            notesList.innerHTML = ''; // Clear current notes list
            for (var i = 0; i < resultSet.rows.length; i++) {
                var note = resultSet.rows.item(i);
                var noteItem = document.createElement('ons-list-item');
                noteItem.setAttribute('data-id', note.id);
                noteItem.innerHTML = `
                    ${note.content}
                    <div class="right">
                        <ons-icon icon="ion-ios-trash" data-id="${note.id}"></ons-icon>
                    </div>
                `;
                notesList.appendChild(noteItem);

                var trashIcon = noteItem.querySelector('.right ons-icon');
                trashIcon.addEventListener('click', (function(noteId, item) {
                    return function(event) {
                        event.stopPropagation();
                        deleteNote(noteId, item);
                    };
                })(note.id, noteItem));
            }
        }, function(tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function deleteNote(id, item) {
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM notes WHERE id = ?', [id], function(tx, res) {
            console.log('Note deleted');
            item.remove(); // Eliminar el elemento de la lista de notas
        }, function(tx, error) {
            console.log('DELETE error: ' + error.message);
        });
    });
}