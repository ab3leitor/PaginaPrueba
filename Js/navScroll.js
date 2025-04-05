// Configuración global
const config = {
    // Comportamiento del navbar
    navbarHideDelay: 5000, // 5 segundos
    topTriggerHeight: 50, // Área superior para mostrar navbar
    
    // Comportamiento del scroll
    scrollSpeed: 800, // Duración en ms
    easing: 'easeInOutCubic', // Tipo de easing
    wheelDeltaThreshold: 30, // Sensibilidad del scroll
    sectionSelector: 'section', // Selector de secciones
    navLinksSelector: 'a[href^="#"]' // Selector de enlaces de navegación
};

// Elementos del DOM
const navbar = document.querySelector('.navbar.bg-dark');
const sections = Array.from(document.querySelectorAll(config.sectionSelector));

// Estado de la aplicación
let appState = {
    lastScroll: 0,
    mouseInTopArea: false,
    hideTimeout: null,
    isScrolling: false,
    currentPosition: window.pageYOffset
};

// Funciones de easing
const easings = {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3)
};

// Polyfill para requestAnimationFrame
const requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

/**
 * Scroll suave a una posición específica
 * @param {number} targetPosition - Posición vertical de destino
 */
function smoothScroll(targetPosition) {
    if (appState.isScrolling) return;
    
    appState.isScrolling = true;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    function scrollStep(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / config.scrollSpeed, 1);
        const easedProgress = easings[config.easing](progress);
        
        window.scrollTo(0, startPosition + (distance * easedProgress));
        
        if (progress < 1) {
            requestAnimFrame(scrollStep);
        } else {
            appState.isScrolling = false;
        }
    }
    
    requestAnimFrame(scrollStep);
}

/**
 * Encuentra la sección actual basada en la posición del viewport
 */
function getCurrentSectionIndex() {
    return sections.findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
    });
}

/**
 * Maneja el evento de scroll con la rueda del mouse
 */
function handleWheelScroll(e) {
    if (appState.isScrolling) {
        e.preventDefault();
        return;
    }

    const delta = Math.sign(e.deltaY);
    if (Math.abs(e.deltaY) < config.wheelDeltaThreshold) return;

    e.preventDefault();
    
    // Obtener todos los elementos desplazables (header + sections)
    const scrollableElements = [
        document.querySelector('header'), // Añade el header como primer elemento
        ...sections // Las secciones normales
    ].filter(el => el !== null); // Filtra elementos nulos por si no existe header
    
    // Encontrar el elemento actual visible
    const currentElementIndex = scrollableElements.findIndex(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
    });
    
    // Determinar el índice del siguiente elemento
    let targetIndex;
    if (delta > 0) { // Scroll hacia abajo
        targetIndex = Math.min(currentElementIndex + 1, scrollableElements.length - 1);
    } else { // Scroll hacia arriba
        targetIndex = Math.max(currentElementIndex - 1, 0);
    }
    
    // Calcular posición con offset del navbar
    const navbarHeight = navbar.offsetHeight;
    const targetElement = scrollableElements[targetIndex];
    let targetPosition = targetElement.offsetTop;
    
    // Ajustar posición si no es el primer elemento (header)
    if (targetIndex > 0) {
        targetPosition = targetPosition - navbarHeight;
    }
    
    // Scroll suave a la posición calculada
    smoothScroll(targetPosition);
}

/**
 * Maneja la navegación con teclado
 */
function handleKeyboardNavigation(e) {
    if (appState.isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentSection = document.elementFromPoint(
            window.innerWidth / 2, 
            window.innerHeight / 2
        ).closest(config.sectionSelector);
        const nextSection = currentSection?.nextElementSibling;
        if (nextSection) smoothScroll(nextSection.offsetTop);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentSection = document.elementFromPoint(
            window.innerWidth / 2, 
            window.innerHeight / 2
        ).closest(config.sectionSelector);
        const prevSection = currentSection?.previousElementSibling;
        if (prevSection) smoothScroll(prevSection.offsetTop);
    }
}

/**
 * Controla la visibilidad del navbar basado en el scroll
 */
function handleNavbarVisibility() {
    const currentScroll = window.pageYOffset;
    
    clearTimeout(appState.hideTimeout);
    
    if (currentScroll <= 0) {
        navbar.classList.add('visible');
    } else if (currentScroll > appState.lastScroll && currentScroll > 100) {
        if (!appState.mouseInTopArea) {
            navbar.classList.remove('visible');
        }
    } else {
        navbar.classList.add('visible');
        appState.hideTimeout = setTimeout(() => {
            if (!appState.mouseInTopArea && window.pageYOffset > 0) {
                navbar.classList.remove('visible');
            }
        }, config.navbarHideDelay);
    }
    
    appState.lastScroll = currentScroll;
}

/**
 * Maneja el movimiento del mouse para mostrar el navbar
 */
function handleMouseMove(e) {
    appState.mouseInTopArea = e.clientY < config.topTriggerHeight;
    navbar.classList.toggle('visible', appState.mouseInTopArea || window.pageYOffset === 0);
}

/**
 * Maneja los clicks en los enlaces de navegación
 */
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        smoothScroll(targetElement.offsetTop);
        navbar.classList.add('visible');
        
        setTimeout(() => {
            if (window.pageYOffset > 0 && !appState.mouseInTopArea) {
                navbar.classList.remove('visible');
            }
        }, 2000);
    }
}

// Inicialización
function init() {
    // Evento de scroll para el navbar
    window.addEventListener('scroll', handleNavbarVisibility);
    
    // Evento de movimiento del mouse
    document.addEventListener('mousemove', handleMouseMove);
    
    // Evento de rueda del mouse para scroll entre secciones
    document.addEventListener('wheel', handleWheelScroll, { passive: false });
    
    // Evento de teclado para navegación
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Eventos para enlaces de navegación
    document.querySelectorAll(config.navLinksSelector).forEach(anchor => {
        anchor.addEventListener('click', handleNavLinkClick);
    });
    
    // Polyfill para navegadores antiguos sin soporte de scroll-behavior
    if (!('scrollBehavior' in document.documentElement.style)) {
        window.smoothScroll = smoothScroll;
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);