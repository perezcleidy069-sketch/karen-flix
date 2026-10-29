
// Función para cambiar entre pantallas (Inicio, Detalle, etc.)
function mostrarSeccion(nombreSeccion) {
    const secciones = document.querySelectorAll('.seccion-pantalla');
    secciones.forEach(sec => sec.classList.add('oculto'));

    const seccionActiva = document.getElementById(`sec-${nombreSeccion}`);
    if (seccionActiva) {
        seccionActiva.classList.remove('oculto');
    }
}

// Búsqueda en tiempo real mientras vas escribiendo
document.getElementById('input-busqueda').addEventListener('input', (evento) => {
    const textoBuscado = evento.target.value.toLowerCase();
    const tarjetas = document.querySelectorAll('.tarjeta-pelicula');

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('h4').textContent.toLowerCase();
        
        if (titulo.includes(textoBuscado)) {
            tarjeta.style.display = 'block';
        } else {
            tarjeta.style.display = 'none';
        }
    });
});