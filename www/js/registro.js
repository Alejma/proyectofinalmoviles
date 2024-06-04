async function FuncionRegistrar() {
    var RegistroCorreo = document.getElementById('Correo').value;
    var RegistroTel = document.getElementById('NumTele').value;
    var RegistroNombre = document.getElementById('NombreCompleto').value;
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

    try {
        const password = "contra-maestra-moviles"; //Contraseña maestra
        const { iv, encrypted } = await encryptString(RegistroContra, password);
        const encryptedContra = JSON.stringify({ iv, encrypted });

        window.db.transaction(function(tx) {
            tx.executeSql('INSERT INTO usuarios (correo, telefono, nombre_completo, nombre_usuario, contrasena) VALUES (?, ?, ?, ?, ?)',
                [RegistroCorreo, RegistroTel, RegistroNombre, RegistroUsuario, encryptedContra],
                function(tx, res) {
                    ons.notification.alert('Registro exitoso!');
                    window.location.href = 'login.html';
                },
                function(tx, error) {
                    ons.notification.alert('Error al registrar: ' + error.message);
                }
            );
        });
    } catch (error) {
        ons.notification.alert('Error durante el cifrado: ' + error.message);
    }
}

function CancelarRegistro() {
    window.location.href = 'login.html';
}