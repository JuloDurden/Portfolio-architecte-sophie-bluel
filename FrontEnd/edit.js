import { boutonsTri } from './script.js';

// Récupération des infos de l'utilisateur connecté
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Modification de la page d'accueil en fonction de la connexion de l'utilisateur
if (token && userId) {
    // Ici vont être mises en places les modifications de la page d'accueil
    // Création du bandeau du mode édition
    const EditModeSection = document.querySelector('body');
    const EditMode = document.createElement('div');
    const EditPhantom = document.createElement('div');
    EditMode.className = 'edit-mode';
    EditPhantom.className = 'edit-phantom';
    EditMode.innerHTML = "<i class=\"fa-regular fa-pen-to-square\"></i>\n<p>Mode édition</p>"
    EditModeSection.insertBefore(EditMode, EditModeSection.querySelector('header'));
    EditModeSection.insertBefore(EditPhantom, EditModeSection.querySelector('header'));

    // Modification de terme login dans le menu
    const navLogin = document.getElementById('nav-login');
    navLogin.innerText = 'logout';

    // Création du bouton modifier à côté du titre de la galerie
    const btnModifier = document.querySelector('.portfolio-title');
    const btnModifierSpan = document.createElement('span');
    btnModifierSpan.innerHTML = "<i class=\"fa-regular fa-pen-to-square\"></i><p>modifier</p>"
    btnModifier.appendChild(btnModifierSpan);

    // Suppression de la div boutons-tri
    boutonsTri.classList.add('hidden');
}

// Ajouter un événement click sur le bouton nav-login
document.getElementById('nav-login').addEventListener('click', function() {
    // Effacer les valeurs du token et de l'userId du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  
    // Charger la page index.html sans les modifications
    window.location.href = 'index.html';
    // return false;

    // window.location.replace('index.html');
    
    // window.history.pushState({}, '', 'index.html');
    // window.location.reload();

  });