function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
        if (currentPage.includes('detailsEleve.html')) {
            if (link.getAttribute('href') === 'gestionEleves.html') {
                link.classList.add('active');
            }
        } else if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Appeler la fonction au chargement
document.addEventListener('DOMContentLoaded', setActivePage);