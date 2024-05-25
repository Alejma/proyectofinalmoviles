
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

function addTask(){
window.location.href = 'addTarea.html';
}
















document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'home') {
    // Obtener referencia al ons-fab
    var fabButton = document.getElementById('fab-button');

    // Agregar evento de clic al ons-fab
    fabButton.addEventListener('click', function() {
      // Navegar a la página add-tarea.html
      myNavigator.pushPage('add-tarea.html');
    });
  }
});