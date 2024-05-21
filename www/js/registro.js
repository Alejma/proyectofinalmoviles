function FuncionRegistrar() {
    var RegistroCorreo = document.getElementById('Correo').value;
    var RegistroTel = document.getElementById('NumTele').value;
    var RegistroUsuario = document.getElementById('NombreUsuario').value;
    var RegistroContra = document.getElementById('Contra').value;
    var RegistroVerifContra = document.getElementById('VerifContra').value;

    ons.notification.alert("Correo: " + RegistroCorreo + "\nTeléfono :" + RegistroTel + "\nUsuario: " + RegistroUsuario + "\nContraseña: " + RegistroContra + "\nVerificación de contraseña: " + RegistroVerifContra)
}

function CancelarRegistro() {
    window.location.href = 'login.html';
}

