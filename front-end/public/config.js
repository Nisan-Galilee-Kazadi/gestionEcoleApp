document.getElementById("inscriptBtn").addEventListener("click", () => {
    document.getElementById("inscriptionDialog").style.display = "block";
    document.querySelector("main").style.filter = "blur(5px)";  // Applique le flou
});

document.getElementById("navButton").addEventListener("click", () => {
    document.getElementById("connexionDialog").style.display = "block";
    document.querySelector("main").style.filter = "blur(5px)";  // Applique le flou
});

function closeDialog(id) {
    document.getElementById(id).style.display = "none";
    document.querySelector("main").style.filter = "none";  // Retire le flou
}

// Afficher le bouton "Back to top" après avoir fait défiler 1000vh
window.addEventListener("scroll", () => {
    const backTop = document.getElementById("backTop");
    const aboutSection = document.getElementById("a-propos").offsetTop;

    if (window.scrollY >= 1000 * window.innerHeight) {  // Condition de 1000vh
        backTop.style.display = "none";
    } else {
        backTop.style.display = "block";
    }
});

const fullscreenBtn = document.getElementById('fullscreenBtn');
    
fullscreenBtn.addEventListener('click', () => {
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
});


