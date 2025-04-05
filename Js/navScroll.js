// Navbar que se esconde al hacer scroll y aparece al pasar el mouse arriba

const navbar = document.querySelector('.navbar.bg-dark');
let lastScroll = 0;
let mouseInTopArea = false;
let hideTimeout = null; // Nuevo timeout para controlar la visibilidad
const topTriggerHeight = 50;
const visibilityDuration = 5000; // 5 segundos

// Control del navbar con scroll
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Resetear timeout cada vez que hay scroll
    clearTimeout(hideTimeout);
    
    if (currentScroll <= 0) {
        navbar.classList.add('visible');
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        if (!mouseInTopArea) {
            navbar.classList.remove('visible');
        }
    } else {
        navbar.classList.add('visible');
        // Programar ocultamiento después de 5 segundos
        hideTimeout = setTimeout(() => {
            if (!mouseInTopArea && window.pageYOffset > 0) {
                navbar.classList.remove('visible');
            }
        }, visibilityDuration);
    }
    
    lastScroll = currentScroll;
});

// Mostrar navbar cuando el mouse está en la parte superior
document.addEventListener('mousemove', (e) => {
    mouseInTopArea = e.clientY < topTriggerHeight;
    navbar.classList.toggle('visible', mouseInTopArea || window.pageYOffset === 0);
});

// Scroll suave entre secciones (mejorado)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
            
            // Mostrar navbar al hacer click en un enlace
            navbar.classList.add('visible');
            
            // Mantener visible el navbar por un tiempo después de hacer click
            setTimeout(() => {
                if (window.pageYOffset > 0 && !mouseInTopArea) {
                    navbar.classList.remove('visible');
                }
            }, 2000);
        }
    });
});

// Mejorar el scroll suave para navegadores que no soportan scroll-behavior
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScroll = (targetPosition, duration) => {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScroll(targetElement.offsetTop, 800);
            }
        });
    });
}