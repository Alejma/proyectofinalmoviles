
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

//------------------------------> FUNCIONALIDAD <-----------------------------------------------

// Evento del elemento ons-fab para navegar a la pagina add-tarea.html
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'home') {
    // Obtener referencia al alemento ons-fab que se encuentra en home.html
    var fabButton = document.getElementById('fab-button');

    // Agregar evento de clic al elemento ons-fab
    fabButton.addEventListener('click', function() {
      // Navegar a la página add-tarea.html
      myNavigator.pushPage('add-tarea.html');
    });

    // Manejar eliminación de tareas
    var taskList = document.getElementById('lista');
    taskList.addEventListener('click', function(event) {
       if (event.target.closest('.ion-ios-trash')) {
           event.target.closest('ons-list-item').remove();
       }
    });

  } else if (page.id === 'add-tarea') {
    var saveButton = page.querySelector('ons-toolbar-button[component="button/save-task"]');
    saveButton.onclick = function() {
        var titleInput = document.querySelector('#title-input');
        var taskDate = document.querySelector('#taskDate');
        var taskTime = document.querySelector('#taskTime');

        if (titleInput.value) {
            var list = document.querySelector('#lista');
            var newItem = document.createElement('ons-list-item');
            newItem.innerHTML = `
               <label class="left">
                   <ons-checkbox input-id="check-${Date.now()}"></ons-checkbox>
               </label>
               <label for="check-${Date.now()}" class="center">
                   ${titleInput.value}
               </label>
               <label class="right"><ons-icon icon="ion-ios-trash"></ons-icon></label>
            `;
            list.appendChild(newItem);

            document.querySelector('#myNavigator').popPage();
        } else {
            ons.notification.alert('Por favor ingresa un título para la tarea.');
        }
    };
  }
});