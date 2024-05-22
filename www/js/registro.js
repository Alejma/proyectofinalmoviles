function FuncionRegistrar() {
    var RegistroCorreo = document.getElementById('Correo').value;
    var RegistroTel = document.getElementById('NumTele').value;
    var RegistroUsuario = document.getElementById('NombreUsuario').value;
    var RegistroContra = document.getElementById('Contra').value;
    var RegistroVerifContra = document.getElementById('VerifContra').value;

    if (RegistroContra !== RegistroVerifContra) {
        ons.notification.alert('Las contraseñas no coinciden');
        return;
    }

    if (!window.db) {
        ons.notification.alert('La base de datos no está inicializada. Por favor, inténtelo de nuevo.');
        return;
    }

    window.db.transaction(function(tx) {
        tx.executeSql('INSERT INTO usuarios (correo, telefono, nombre_usuario, contrasena) VALUES (?, ?, ?, ?)',
            [RegistroCorreo, RegistroTel, RegistroUsuario, RegistroContra],
            function(tx, res) {
                ons.notification.alert('Registro exitoso!');
                window.location.href = 'login.html';
            },
            function(tx, error) {
                ons.notification.alert('Error al registrar: ' + error.message);
            }
        );
    });
}

function CancelarRegistro() {
    window.location.href = 'login.html';
}
