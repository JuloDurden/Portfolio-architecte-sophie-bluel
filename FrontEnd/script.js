// Récupération des travaux depuis le back-end
    const reponse = await fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const travaux = await reponse.json();
    console.log('Réponse API script :', reponse);
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

// Génération des catégories possibles lors de l'ajout d'une photo
const select = document.getElementById('category');
categories.forEach(categorie => {
    if (categorie !== 'Tous') {
        const option = document.createElement('option');
        option.value = categorie.toLowerCase().replace(/\s/g, '-');
        option.textContent = categorie;
        select.appendChild(option);
    }
});

// Génération de la fiche d'un travail
    function genererFiche(travaux) {
        // Récupération de l'élément du DOM qui accueillera le travail
        const galleryTravaux = document.querySelector('.gallery');
        console.log('Div class="gallery" trouvée:', galleryTravaux);
        galleryTravaux.innerHTML = '';
        travaux.forEach(travail => {
            // Création d'une fiche dédiée à un travail et de ses balises
            const ficheTravail = document.createElement('figure');
            const imageTravail = document.createElement('img');
            imageTravail.src = travail.imageUrl;
            const nomTravail =  document.createElement('figcaption');
            nomTravail.innerText = travail.title;
            // On rattache la balise fiche à la section Travaux
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
            .then((reponse) => {
                if (reponse.ok) {
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

// Changer le contenu de la modale en cliquant sur le bouton "Ajouter une photo"
    const addPhotoButton = document.getElementById('add-photo');
    const modalGallery = document.getElementById('modal-gallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');
    
    addPhotoButton.addEventListener('click', function() {
      modalGallery.style.display = 'none';
      modalAddPhoto.style.display = 'block';
    });
    
    // Pour revenir à la modale de galerie
    const modalAddPhotoBackButton = document.querySelector('#modal-addphoto i.fa-arrow-left');
    modalAddPhotoBackButton.addEventListener('click', function() {
      modalAddPhoto.style.display = 'none';
      modalGallery.style.display = 'block';
    });
    

// Affichage des fiches
    genererFiche(travaux);
    document.querySelector('.boutons-tri button[data-categorie="Tous"]').classList.toggle('active');
    genererFicheModal(travaux);

export { boutonsTri };