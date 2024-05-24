document.addEventListener('init', fuction(event){
    var page = event.target;

    if (page.id == 'home') {
        document.getElementById('fab-button').addEventListener('click', function(){
            document.querySelector('#tareas-navigator').pushPage('add-tarea.html');
        });
    }
});