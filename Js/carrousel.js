document.addEventListener('DOMContentLoaded', function() {
    // Configuración del carrusel
    const carrusel = new bootstrap.Carousel('#proyectosCarousel', {
        interval: 3000,  // 3 segundos por slide
        ride: 'carousel',
        wrap: true,
        pause: 'hover'   // Pausa solo al hacer hover
    });

    // Sincronizar indicadores externos
    const carruselElement = document.getElementById('proyectosCarousel');
    const indicadores = document.querySelectorAll('.carousel-external-indicators button');
    
    carruselElement.addEventListener('slid.bs.carousel', function() {
        const activeIndex = [...this.querySelectorAll('.carousel-item')].findIndex(item => item.classList.contains('active'));
        indicadores.forEach((ind, index) => {
            ind.classList.toggle('active', index === activeIndex);
        });
    });

    // Click en indicadores externos
    indicadores.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            carrusel.to(index);
        });
    });
});