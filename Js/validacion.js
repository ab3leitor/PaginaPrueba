document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuración inicial
    const form = document.getElementById('contactForm');
    const campos = {
        nombre: document.getElementById('nombre'),
        email: document.getElementById('email'),
        telefono: document.getElementById('telefono'),
        mensaje: document.getElementById('mensaje')
    };
    const contador = document.getElementById('contador');

    // 2. Patrones de validación mejorados
    const patrones = {
        nombre: /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        telefono: /^(\+?\d{1,3}[-.\s]?)?(\(\d{1,4}\)[-.\s]?)?[\d\s-]{6,14}$/,
        noEspacios: /\S/
    };

    // 3. Mensajes de error mejorados
    const mensajesError = {
        nombre: {
            requerido: 'El nombre es requerido',
            minLength: 'Mínimo 3 caracteres',
            maxLength: 'Máximo 50 caracteres',
            formato: 'Solo letras y espacios (no números ni caracteres especiales)'
        },
        email: {
            requerido: 'El email es requerido',
            formato: 'Email inválido. Ejemplo válido: usuario@dominio.com'
        },
        telefono: {
            requerido: 'El teléfono es requerido',
            formato: 'Formato inválido. Ejemplos válidos: 1234567890, 123-456-7890, +34 123 456 789',
            minLength: 'Mínimo 6 dígitos',
            maxLength: 'Máximo 15 dígitos (incluyendo código de país)'
        },
        mensaje: {
            requerido: 'El mensaje es requerido',
            soloEspacios: 'No puede contener solo espacios',
            minLength: 'Mínimo 10 caracteres válidos (sin contar espacios)',
            maxLength: 'Máximo 500 caracteres'
        }
    };

    // 4. Inicializar eventos
    function inicializarValidaciones() {
        // Configurar eventos para cada campo
        Object.entries(campos).forEach(([nombre, campo]) => {
            if (campo) {
                campo.addEventListener('input', function() {
                    this.classList.remove('is-valid', 'is-invalid');
                    validarCampo(nombre, this);
                });
                campo.addEventListener('blur', function() {
                    validarCampo(nombre, this);
                });
            }
        });

        // Envío del formulario
        form.addEventListener('submit', enviarFormulario);
    }

    // 5. Función de validación unificada
    function validarCampo(tipo, campo) {
        const valor = campo.value.trim();
        resetearEstado(campo);

        // Validación para campo vacío
        if (campo.required && !valor) {
            mostrarError(campo, mensajesError[tipo].requerido);
            return false;
        }

        // Validaciones específicas para cada tipo de campo
        switch(tipo) {
            case 'nombre':
                if (valor.length < 3) {
                    mostrarError(campo, mensajesError.nombre.minLength);
                    return false;
                }
                if (valor.length > 50) {
                    mostrarError(campo, mensajesError.nombre.maxLength);
                    return false;
                }
                if (!patrones.nombre.test(valor)) {
                    mostrarError(campo, mensajesError.nombre.formato);
                    return false;
                }
                break;

            case 'email':
                if (!patrones.email.test(valor)) {
                    mostrarError(campo, mensajesError.email.formato);
                    return false;
                }
                break;

            case 'telefono':
                if (valor) { // Solo validar si hay contenido (campo opcional)
                    const digitos = valor.replace(/\D/g, '');
                    if (digitos.length < 6) {
                        mostrarError(campo, mensajesError.telefono.minLength);
                        return false;
                    }
                    if (digitos.length > 15) {
                        mostrarError(campo, mensajesError.telefono.maxLength);
                        return false;
                    }
                    if (!patrones.telefono.test(valor)) {
                        mostrarError(campo, mensajesError.telefono.formato);
                        return false;
                    }
                }
                break;

            case 'mensaje':
                if (!patrones.noEspacios.test(valor)) {
                    mostrarError(campo, mensajesError.mensaje.soloEspacios);
                    return false;
                }
                if (valor.replace(/\s+/g, ' ').trim().length < 10) {
                    mostrarError(campo, mensajesError.mensaje.minLength);
                    return false;
                }
                if (valor.length > 500) {
                    mostrarError(campo, mensajesError.mensaje.maxLength);
                    if (contador) contador.textContent = '500';
                    return false;
                }
                // Actualizar contador
                if (contador) {
                    contador.textContent = valor.length;
                    actualizarColorContador(valor.length);
                }
                break;
        }

        // Si pasa todas las validaciones
        if (valor || campo.required) {
            mostrarValido(campo);
        }
        return true;
    }

    // 6. Funciones auxiliares mejoradas
    function resetearEstado(campo) {
        campo.classList.remove('is-valid', 'is-invalid');
        const feedback = campo.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    }

    function mostrarError(campo, mensaje) {
        campo.classList.add('is-invalid');
        let feedback = campo.nextElementSibling;
        
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            campo.parentNode.insertBefore(feedback, campo.nextSibling);
        }
        
        feedback.textContent = mensaje;
        feedback.style.display = 'block';
    }

    function mostrarValido(campo) {
        campo.classList.add('is-valid');
        const feedback = campo.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.style.display = 'none';
        }
    }

    function actualizarColorContador(longitud) {
        if (!contador) return;
        
        contador.classList.remove('text-warning', 'text-danger');
        if (longitud > 450) contador.classList.add('text-warning');
        if (longitud >= 500) {
            contador.classList.remove('text-warning');
            contador.classList.add('text-danger');
        }
    }

    // 7. Manejo del envío del formulario mejorado
    function enviarFormulario(e) {
        e.preventDefault();
        
        let formularioValido = true;
        
        // Validar todos los campos
        Object.entries(campos).forEach(([nombre, campo]) => {
            if (campo && !validarCampo(nombre, campo)) {
                formularioValido = false;
            }
        });
        
        if (formularioValido) {
            mostrarFeedback('¡Formulario enviado con éxito!', 'success');
            form.reset();
            resetearFormulario();
        } else {
            mostrarFeedback('Por favor corrige los errores en los campos marcados', 'danger');
            scrollToError();
        }
    }

    function resetearFormulario() {
        Object.values(campos).forEach(campo => {
            if (campo) {
                campo.classList.remove('is-valid', 'is-invalid');
                const feedback = campo.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.textContent = '';
                }
            }
        });
        if (contador) {
            contador.textContent = '0';
            contador.classList.remove('text-warning', 'text-danger');
        }
    }

    function mostrarFeedback(mensaje, tipo) {
        // Eliminar feedback anterior si existe
        const anterior = document.querySelector('.form-feedback');
        if (anterior) anterior.remove();
        
        // Crear nuevo feedback
        const feedback = document.createElement('div');
        feedback.className = `form-feedback alert alert-${tipo} mt-3 fade show`;
        feedback.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Insertar en el DOM
        form.parentNode.insertBefore(feedback, form.nextSibling);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 150);
        }, 5000);
    }

    function scrollToError() {
        const primerError = form.querySelector('.is-invalid');
        if (primerError) {
            primerError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            primerError.focus();
        }
    }

    // Inicializar todo
    inicializarValidaciones();
});