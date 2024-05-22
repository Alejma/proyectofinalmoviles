document.addEventListener('deviceready', function() {
    var db = window.sqlitePlugin.openDatabase({name: 'todoApp.db', location: 'default'});

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, correo TEXT, telefono TEXT, nombre_usuario TEXT, contrasena TEXT)');
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function() {
        console.log('Database and table created successfully');
    });

    window.db = db;
});
