document.getElementById("inscriptBtn").addEventListener("click", () => {
  document.getElementById("inscriptionDialog").style.display = "block";
  document.querySelector("main").style.filter = "blur(5px)"; // Applique le flou
});

document.getElementById("navButton").addEventListener("click", () => {
  document.getElementById("connexionDialog").style.display = "block";
  document.querySelector("main").style.filter = "blur(5px)"; // Applique le flou
});

function closeDialog(id) {
  document.getElementById(id).style.display = "none";
  document.querySelector("main").style.filter = "none"; // Retire le flou
}

// Afficher le bouton "Back to top" après avoir fait défiler 1000vh
window.addEventListener("scroll", () => {
  const backTop = document.getElementById("backTop");
  const aboutSection = document.getElementById("a-propos").offsetTop;

  if (window.scrollY >= 1000 * window.innerHeight) {
    // Condition de 1000vh
    backTop.style.display = "none";
  } else {
    backTop.style.display = "block";
  }
});

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", () => {
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

window.onscroll = function () {
  var button = document.querySelector(".backTop");

  // Vérifie si on est descendu de plus de 100px
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    button.style.display = "block"; // Afficher le bouton
  } else {
    button.style.display = "none"; // Cacher le bouton
  }
};

// Ajoute un effet de défilement en douceur vers l'élément cible
document.querySelector(".backTop a").addEventListener("click", function (e) {
  e.preventDefault(); // Empêche le comportement par défaut du lien

  // Défilement en douceur vers l'élément avec l'id "navBar"
  document.querySelector("#navBar").scrollIntoView({
    behavior: "smooth", // Défilement en douceur
  });
});
