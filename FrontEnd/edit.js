// Récupération des infos de l'utilisateur connecté
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Modification de la page d'accueil en fonction de la connexion de l'utilisateur
if (token && userId) {
    // Ici vont être mises en places les modifications de la page d'accueil
    // Création du bandeau du mode édition
    const EditModeSection = document.querySelector('body');
    const EditMode = document.createElement('div');
    EditMode.className = 'edit-mode';
    EditMode.innerHTML = "<img src=\"./assets/icons/edit.png\" alt=\"icone édition\">\n<p>Mode édition</p>"
    EditModeSection.insertBefore(EditMode, EditModeSection.querySelector('header'));

    // Modification de terme login dans le menu
    const navLogin = document.getElementById('nav-login');
    navLogin.innerText = '';
    navLogin.innerText = 'logout';

    // Création du bouton modifier à côté du titre de la galerie
    const btnModifier = document.querySelector('#portfolio h2');
    const btnModifierSpan = document.createElement('span');
    btnModifierSpan.innerHTML = "<img src=\"assets/icons/edit-black.png\" alt=\"icone modifier\">"
    btnModifierSpan.innerText = 'modifier';
    btnModifierSpan.appendChild(btnModifierSpan);
    btnModifier.appendChild('#portfolio h2');
}