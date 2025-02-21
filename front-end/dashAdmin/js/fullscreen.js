function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // Passer en mode plein écran
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // Quitter le mode plein écran
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// Mettre à jour l'icône selon l'état
function updateFullscreenIcon() {
  const icon = document.querySelector('#fullscreenBtn i');
  if (document.fullscreenElement) {
    icon.classList.remove('fa-expand');
    icon.classList.add('fa-compress');
  } else {
    icon.classList.remove('fa-compress');
    icon.classList.add('fa-expand');
  }
}

// Ajouter les écouteurs d'événements
document.addEventListener('DOMContentLoaded', function() {
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullScreen);
  }
  
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('msfullscreenchange', updateFullscreenIcon);
});
