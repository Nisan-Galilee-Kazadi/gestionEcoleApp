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
        backTop.style.display = "block";
    } else {
        backTop.style.display = "none";
    }
});
