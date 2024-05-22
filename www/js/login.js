function login() {
    var LoginUsuario = document.getElementById('username').value;
    var LoginContra = document.getElementById('password').value;

    if (!window.db) {
        ons.notification.alert('La base de datos no está inicializada. Por favor, inténtelo de nuevo.');
        return;
    }

    window.db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?', [LoginUsuario, LoginContra],
            function(tx, result) {
                if (result.rows.length > 0) {
                    // Autenticación exitosa
                    window.location.href = 'index.html';
                } else {
                    // Usuario o contraseña incorrectos
                    ons.notification.alert('Usuario o contraseña incorrectos.');
                }
            },
            function(tx, error) {
                ons.notification.alert('Error al consultar la base de datos: ' + error.message);
            }
        );
    });
}

function registro() {
    window.location.href = 'registro.html';
}
