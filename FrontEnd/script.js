// Récupération des travaux depuis le back-end
const response = await fetch('http://localhost:5678/api/works', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
const travaux = await response.json();
console.log('Réponse API script :', response);
console.log('Récupération Travaux :', travaux);

// Récupération des catégories uniques
const categories = ['Tous', ...[...new Set(travaux.map(travail => travail.category.name))]];
console.log('Catégories uniques :', categories);

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

// Récupération des catégories complètes (avec ID et nom) depuis l'API
fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((categories) => {
        console.log('Catégories complètes récupérées :', categories);

        // Génération des catégories possibles lors de l'ajout d'une photo
        const select = document.getElementById('categoryPhoto');
        categories.forEach(categorie => {
            if (categorie.name !== 'Tous') {
                const option = document.createElement('option');
                option.value = categorie.id.toString(); 
                option.textContent = categorie.name; 
                select.appendChild(option);
            }
        });
    })
    .catch((error) => console.error('Erreur lors de la récupération des catégories :', error));

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
            fetch(`http://localhost:5678/api/works/${travail.id}`, {
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
    // Collecte des éléments de la modale
        const fileInput = document.getElementById('fileInputPhoto');
        const titleInput = document.getElementById('titlePhoto');
        const categorySelect = document.getElementById('categoryPhoto');
        const validateButton = document.getElementById('validate');

    // Ajout d'un événement pour vérifier l'état des champs
        fileInput.addEventListener('change', checkFields);
        titleInput.addEventListener('input', checkFields);
        categorySelect.addEventListener('change', checkFields);

    // Fonction pour vérifier si les champs sont remplis et valides (taille de l'image)
    function checkFields() {
        const isFileValid = fileInput.files.length > 0 && fileInput.files[0].size < 4 * 1024 * 1024;
        const isTitleValid = titleInput.value.trim() !== '';
        const isCategoryValid = categorySelect.value !== '';

        validateButton.disabled = !(isFileValid && isTitleValid && isCategoryValid);
    }

// Ajout d'un événement pour poster un nouveau travail
    validateButton.addEventListener('click', ajoutTravail);

// Fonction pour poster un nouveau travail
    function ajoutTravail(event) {
        event.preventDefault();

        // Validation des champs
        if (!fileInput.files[0] || !titleInput.value || !categorySelect.value) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        // Vérification des valeurs avec console.log
        console.log('Image :', fileInput.files[0]);
        console.log('Titre :', titleInput.value);
        console.log('Catégorie :', categorySelect.value);
        

        // Récupération de l'ID de la catégorie sélectionnée
        const categoryId = Number(categorySelect.value);

        // Création de l'objet FormData
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categoryId);
        console.log(localStorage.getItem('token'));
        console.log(formData);

        // Envoi de la requête POST
        fetch('http://localhost:5678/api/works', {
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

                // Mise à jour de la galerie et de la section portfolio
                travaux.push(data);
                genererFiche(travaux);
                genererFicheModal(travaux);

                // Réinitialisation des champs
                document.querySelector('.add-frame i').style.display = 'block';
                document.querySelector('.add-frame label').style.display = 'block';
                document.querySelector('.add-frame p').style.display = 'block';
                document.getElementById('imagePreview').style.display = 'none';
                fileInput.textContent = '+ Ajouter photo';
                titleInput.value = '';
                categorySelect.value = '';
                validateButton.disabled = true;
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
// Ajout d'un événement pour afficher l'aperçu de l'image sélectionnée
    fileInput.addEventListener('change', function () {
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
    });

// Changer le contenu de la modal en cliquant sur le bouton "Ajouter une photo"
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
