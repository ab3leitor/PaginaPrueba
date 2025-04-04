document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('backgroundMusic');
    const muteBtn = document.getElementById('muteBtn');
    const volumeToggleBtn = document.getElementById('volumeToggleBtn');
    const volumeControl = document.getElementById('volumeControl');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeUpBtn = document.getElementById('volumeUpBtn');
    const volumeDownBtn = document.getElementById('volumeDownBtn');
    
    // Estado inicial - volumen bajo (10%) y no muteado
    let isMuted = false;
    let isVolumeControlVisible = false;
    let isFirstInteraction = true;
    
    // Configuración inicial del volumen
    function initMusicSettings() {
        music.volume = 0.1; // Volumen bajo inicial (10%)
        music.muted = false; // No muteado
        volumeSlider.value = 0.1; // Actualizar slider
        updateVolumeIcons(); // Actualizar íconos
    }
    
    // Iniciar música después de interacción del usuario
    function initMusicPlayback() {
        if (isFirstInteraction) {
            initMusicSettings();
            music.play().catch(e => console.log("Reproducción automática bloqueada:", e));
            isFirstInteraction = false;
        }
    }
    
    // Mute/Unmute
    muteBtn.addEventListener('click', function() {
        initMusicPlayback();
        isMuted = !isMuted;
        music.muted = isMuted;
        this.innerHTML = `<i class="bi bi-volume-${isMuted ? 'mute' : music.volume > 0.5 ? 'up' : 'down'} fs-6"></i>`;
        this.title = isMuted ? "Activar sonido" : "Silenciar";
    });
    
    // Alternar controles de volumen
    volumeToggleBtn.addEventListener('click', function() {
        initMusicPlayback();
        isVolumeControlVisible = !isVolumeControlVisible;
        volumeControl.classList.toggle('d-none', !isVolumeControlVisible);
        volumeControl.classList.toggle('d-flex', isVolumeControlVisible);
    });
    
    // Control de volumen con slider
    volumeSlider.addEventListener('input', function() {
        music.volume = this.value;
        updateVolumeIcons();
    });
    
    // Subir volumen (10% por clic)
    volumeUpBtn.addEventListener('click', function() {
        initMusicPlayback();
        const newVolume = Math.min(1, music.volume + 0.1);
        music.volume = newVolume;
        volumeSlider.value = newVolume;
        updateVolumeIcons();
    });
    
    // Bajar volumen (10% por clic)
    volumeDownBtn.addEventListener('click', function() {
        initMusicPlayback();
        const newVolume = Math.max(0, music.volume - 0.1);
        music.volume = newVolume;
        volumeSlider.value = newVolume;
        updateVolumeIcons();
    });
    
    // Actualizar íconos según el volumen actual
    function updateVolumeIcons() {
        const vol = music.volume;
        let icon;
        
        if (vol === 0) icon = 'off';
        else if (vol < 0.5) icon = 'down';
        else icon = 'up';
        
        // Actualizar ícono del botón de volumen principal
        volumeToggleBtn.innerHTML = `<i class="bi bi-volume-${icon} fs-6"></i>`;
        
        // Actualizar ícono del botón de mute si no está muteado
        if (!isMuted) {
            muteBtn.innerHTML = `<i class="bi bi-volume-${icon} fs-6"></i>`;
        }
    }
    
    // Configuración inicial al cargar
    initMusicSettings();
    
    // Iniciar reproducción con cualquier interacción
    document.addEventListener('click', initMusicPlayback, { once: true });
    document.addEventListener('keydown', initMusicPlayback, { once: true });
});