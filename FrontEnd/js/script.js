// Création de la constante ApiUrl pour l'URL de l'API
const ApiUrl = 'http://localhost:5678/api';

// Récupération des travaux depuis le back-end
const response = await fetch(`${ApiUrl}/works`);
const travaux = await response.json();
// Vérification de la réponse de l'API et des travaux récupérés
console.log('Réponse API script :', response);
console.log('Récupération Travaux :', travaux);

// Génération de la fiche d'un travail
function genererFiche(travaux) {
    const galleryTravaux = document.querySelector('.gallery');
    console.log('Div class="gallery" trouvée:', galleryTravaux);
    galleryTravaux.innerHTML = '';
    travaux.forEach(travail => {
        const ficheTravail = document.createElement('figure');
        const imageTravail = document.createElement('img');
        imageTravail.src = travail.imageUrl;
        const nomTravail = document.createElement('figcaption');
        nomTravail.innerText = travail.title;
        galleryTravaux.appendChild(ficheTravail);
        ficheTravail.appendChild(imageTravail);
        ficheTravail.appendChild(nomTravail);
    });
}

// Récupération des catégories depuis l'API pour les afficher dans les boutons de tri
const responseCategories = await fetch(`${ApiUrl}/categories`);
const categoriesApi = await responseCategories.json();
// Récupération des noms des catégories
const categoriesApiNames = categoriesApi.map(categorie => categorie.name);
console.log('Noms des catégories API :', categoriesApiNames);
// Ajout de la catégorie "Tous"
const categories = ['Tous', ...categoriesApiNames];
console.log('Catégories :', categories);

// Création de l'élément pour les boutons de tri
const portfolioSection = document.getElementById('portfolio');
const boutonsTri = document.createElement('div');
boutonsTri.className = 'boutons-tri';
portfolioSection.insertBefore(boutonsTri, portfolioSection.querySelector('.gallery'));

// Création des boutons de tri par catégorie
categories.forEach(categorie => {
    const boutonTri = document.createElement('button');
    boutonTri.innerText = categorie;
    boutonTri.dataset.categorie = categorie;
    boutonsTri.appendChild(boutonTri);
});

// Ajout d'un événement de click sur les boutons de tri
document.querySelectorAll('.boutons-tri button').forEach(boutonTri => {
    boutonTri.addEventListener('click', () => {
        // Suppression de la classe button-active des autres boutons
        document.querySelectorAll('.boutons-tri button').forEach(bouton => {
            bouton.classList.remove('active');
        });
        // Ajout de la classe button-active au bouton cliqué
        boutonTri.classList.add('active');
        const categorie = boutonTri.dataset.categorie;
        console.log('Catégorie trouvée:', categorie);
        if (categorie === 'Tous') {
            genererFiche(travaux);
        } else {
            const travauxFiltres = travaux.filter(travail => travail.category.name === categorie);
            genererFiche(travauxFiltres);
        };
    });
});

// Génération de la fiche d'un travail dans la modale
function genererFicheModal(travaux) {
    const galleryTravaux = document.querySelector('.galleryMod');
    console.log('Div class= "gallery Modal" trouvée', galleryTravaux);
    galleryTravaux.innerHTML = '';
    travaux.forEach(travail => {
        // Création d'une fiche dédiée à un travail et de ses balises
        const ficheTravail = document.createElement('figure');
        const imageTravail = document.createElement('img');
        imageTravail.src = travail.imageUrl;
        const travailTrash = document.createElement('i');
        // Ajout de l'icone de suppression de la fiche
        travailTrash.className = 'fa-solid fa-trash-can fa-border';
        // Suppression d'une fiche en cliquant sur l'icone de suppression avec appel au Back-end
        travailTrash.addEventListener('click', () => {
            fetch(`${ApiUrl}/works/${travail.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Travail supprimé avec succès');
                        genererFicheModal(travaux.filter(t => t.id !== travail.id));
                        genererFiche(travaux.filter(t => t.id !== travail.id));
                    } else {
                        console.log('Erreur lors de la suppression du travail');
                    }
                })
                .catch((error) => console.error('Erreur lors de la suppression du travail', error));
        });
        // On rattache la balise fiche à la section Travaux
        ficheTravail.appendChild(imageTravail);
        ficheTravail.appendChild(travailTrash);
        ficheTravail.style.position = 'relative';
        galleryTravaux.appendChild(ficheTravail);
    })
}

// Ajout d'un nouveau travail au back-end
// Génération des catégories possibles lors de l'ajout d'une photo
const select = document.getElementById('categoryPhoto');
categoriesApi.forEach(categorie => {
    const option = document.createElement('option');
    option.value = categorie.id.toString(); 
    option.textContent = categorie.name; 
    select.appendChild(option);
});

// Fermeture de la modale
function fermetureModale() {
    const modalGallery = document.getElementById('modal-gallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');
    document.getElementById('modal1').style.display = 'none';
    modalAddPhoto.style.display = 'none';
    modalGallery.style.display = 'block';
}

// Collecte des éléments de la modale
const fileInput = document.getElementById('fileInputPhoto');
const titleInput = document.getElementById('titlePhoto');
const categorySelect = document.getElementById('categoryPhoto');
const validateButton = document.getElementById('validate');
const errorMessage = document.getElementById('error-message');

// Ajout d'un événement pour afficher l'aperçu de l'image sélectionnée
fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
        const validTypes = ['image/jpeg', 'image/png'];
        if (validTypes.includes(file.type) && file.size < 4 * 1024 * 1024) {
            afficherApercuImage();
            errorMessage.innerHTML = '';
            validateButton.disabled = false;
        } else {
            errorMessage.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i> Votre image doit être au format JPG ou PNG et faire moins de 4 Mo</span>';
            validateButton.disabled = true;
        }
    } else {
        validateButton.disabled = true;
    }
});


// Ajout d'un événement pour poster un nouveau travail
validateButton.addEventListener('click', ajoutTravail);

function ajoutTravail(event) {
    event.preventDefault();
    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const categoryId = Number(category);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    // Vérifier si le titre et la catégorie sont renseignés
    let erreur = '';
    if (title === '') {
        erreur += '<span><i class="fa-solid fa-triangle-exclamation"></i> Veuillez ajouter un titre</span>';
    }
    if (category === '') {
        erreur += '<span><i class="fa-solid fa-triangle-exclamation"></i> Veuillez sélectionner une catégorie</span>';
    }

    if (erreur !== '') {
        errorMessage.innerHTML = erreur;
        return;
    } else {
        errorMessage.innerHTML = '';
    }

    fetch(`${ApiUrl}/works`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du travail');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Travail ajouté avec succès', data);
            travaux.push(data);
            genererFiche(travaux);
            genererFicheModal(travaux);

            document.querySelector('.add-frame i').style.display = 'block';
            document.querySelector('.add-frame label').style.display = 'block';
            document.querySelector('.add-frame p').style.display = 'block';
            document.getElementById('imagePreview').style.display = 'none';
            fileInput.textContent = '+ Ajouter photo';
            titleInput.value = '';
            categorySelect.value = '';
            validateButton.disabled = true;
            fermetureModale();
        })
        .catch((error) => {
            console.error('Erreur :', error);
        });
}

// Ajout d'un événement pour déclencher l'ouverture de la fenêtre de sélection du fichier d'image
    const fileButton = document.querySelector('.file-button');
    fileButton.addEventListener('click', function () {
        fileInput.click();
    });

// Fonction pour afficher l'aperçu de l'image sélectionnée
function afficherApercuImage() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            // Masquer les éléments existants
            document.querySelector('.add-frame i').style.display = 'none';
            document.querySelector('.add-frame input').style.display = 'none';
            document.querySelector('.add-frame label').style.display = 'none';
            document.querySelector('.add-frame p').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Changer le contenu de la modale en cliquant sur le bouton "Ajouter une photo"
    const addPhotoButton = document.getElementById('add-photo');
    const modalGallery = document.getElementById('modal-gallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');

    addPhotoButton.addEventListener('click', function () {
        modalGallery.style.display = 'none';
        modalAddPhoto.style.display = 'block';
    });

// Pour revenir à la modale de galerie
    const modalAddPhotoBackButton = document.querySelector('#modal-addphoto i.fa-arrow-left');
    modalAddPhotoBackButton.addEventListener('click', function () {
        modalAddPhoto.style.display = 'none';
        modalGallery.style.display = 'block';
    });

// Affichage des fiches
    genererFiche(travaux);
    document.querySelector('.boutons-tri button[data-categorie="Tous"]').classList.toggle('active');
    genererFicheModal(travaux);

export { boutonsTri };
export { ApiUrl };
