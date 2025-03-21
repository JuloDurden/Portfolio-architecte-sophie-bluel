import { boutonsTri } from './script.js';

// Récupération des infos de l'utilisateur connecté
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Modification de la page d'accueil en fonction de la connexion de l'utilisateur
if (token && userId) {
    // Ici vont être mises en places les modifications de la page d'accueil
    // Affichage du bandeau du mode édition
    const editMode = document.querySelector('.edit-mode');
    const editPhantom = document.querySelector('.edit-phantom');
    editMode.style.display = "block"
    editPhantom.style.display = "block"

    // Modification de terme login dans le menu
    const navLogin = document.getElementById('nav-login');
    navLogin.innerText = 'logout';
    navLogin.closest('a').href = 'index.html';

    // Création du bouton modifier à côté du titre de la galerie
    const btnModifier = document.querySelector('.portfolio-title');
    const btnModifierSpan = document.createElement('span');
    btnModifierSpan.innerHTML = "<i class=\"fa-regular fa-pen-to-square\"></i><p>modifier</p>"
    btnModifier.appendChild(btnModifierSpan);

    // Suppression de la div boutons-tri
    boutonsTri.classList.add('hidden');


    // Ajouter un événement click sur le bouton nav-login
    document.getElementById('nav-login').addEventListener('click', function() {
        // Effacer les valeurs du token et de l'userId du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        console.log('Le token et le userId ont été effacés du localStorage');
    
        // Charger la page index.html sans les modifications
        window.location.href = 'index.html';
    });

    // Fonctionnement de la modale
        // Ouverture de la modale en cliquant sur "modifier"
        document.querySelector('.portfolio-title span').addEventListener('click', function() {
            document.getElementById('modal1').style.display = 'block';
        });

        // Réinitialisation de la fenêtre d'ajout de photo
        function initModalAddPhoto() {
            const fileInput = document.getElementById('fileInputPhoto');
            const titleInput = document.getElementById('titlePhoto');
            const categorySelect = document.getElementById('categoryPhoto');
            const validateButton = document.getElementById('validate');
            const errorMessage = document.getElementById('error-message')

            document.querySelector('.add-frame i').style.display = 'block';
            document.querySelector('.add-frame label').style.display = 'block';
            document.querySelector('.add-frame p').style.display = 'block';
            document.getElementById('imagePreview').style.display = 'none';
            fileInput.textContent = '+ Ajouter photo';
            titleInput.value = '';
            categorySelect.value = '';
            errorMessage.innerHTML = '';
            validateButton.disabled = true;
        }

        // Fermeture de la modale
        function fermetureModale() {
            const modalGallery = document.getElementById('modal-gallery');
            const modalAddPhoto = document.getElementById('modal-addphoto');
            document.getElementById('modal1').style.display = 'none';
            modalAddPhoto.style.display = 'none';
            modalGallery.style.display = 'block';
            initModalAddPhoto();
        }

        // ... en cliquant sur la croix
        document.querySelectorAll('.fa-xmark').forEach(function(element) {
            element.addEventListener('click', fermetureModale);
        });

        // ... en cliquant sur l'overlay
        document.getElementById('modal1').addEventListener('click', function(event) {
            if (event.target === this) {
                fermetureModale();
            }
        });

        document.querySelector('.modal-wrapper').addEventListener('click', function(event) {
            event.stopPropagation();
        });
}