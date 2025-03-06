// Récupération des travaux depuis le back-end
    const reponse = await fetch('http://localhost:5678/api/works');
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

// Génération de la fiche d'un travail
    function genererFiche(travaux) {
        // Récupération de l'élément du DOM qui accueillera le travail
        const galleryTravaux = document.querySelector('.gallery');
        console.log('Div class="gallery" trouvée:', galleryTravaux);
        galleryTravaux.innerHTML = '';
        travaux.forEach(travail => {
            // Création d'une fiche dédiée à un travail
            const ficheTravail = document.createElement('figure');
            // Création des balises nécessaires
            const imageTravail = document.createElement('img');
            imageTravail.src = travail.imageUrl;
            const nomTravail =  document.createElement('figcaption');
            nomTravail.innerText = travail.title;
            // On rattache la balise fiche à la section Travaux
            galleryTravaux.appendChild(ficheTravail);
            ficheTravail.appendChild(imageTravail);
            ficheTravail.appendChild(nomTravail);
            // Création de la balise catégorie pour la gérer sans l'afficher
            // const catTravail = document.createElement("p");
            // catTravail.innerText = travail.category.name;
        });
    }

// Génération de la fiche d'un travail dans la modale
    function genererFicheModal(travaux) {
        const galleryTravaux = document.querySelector('.galleryMod');
        console.log('Div class= "gallery Modal" trouvée', galleryTravaux);
        galleryTravaux.innerHTML = '';
        travaux.forEach(travail => {
            const ficheTravail = document.createElement('figure');
            const imageTravail = document.createElement('img');
            // const travailTrash = document.createElement('i');
            imageTravail.src = travail.imageUrl;
            // travailTrash.classList.add = 'fa-solid fa-trash-can'
            galleryTravaux.appendChild(ficheTravail);
            ficheTravail.appendChild(imageTravail);
            // ficheTravail.appendChild(travailTrash);
        })
    }

// Affichage des fiches
    genererFiche(travaux);
    document.querySelector('.boutons-tri button[data-categorie="Tous"]').classList.toggle('active');
    genererFicheModal(travaux);

export { boutonsTri };