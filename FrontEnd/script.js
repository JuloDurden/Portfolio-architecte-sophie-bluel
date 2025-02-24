// Affichage des fiches via l'API
    // Récupération des travaux depuis le back-end
    const reponse = await fetch('http://localhost:5678/api/works');
    const travaux = await reponse.json();
    console.log('Réponse API :', reponse);
    console.log('Récupération Travaux :', travaux);

    // Génération de la fiche d'un travail
    function genererFiche(travaux) {    
        for (let i = 0; i < travaux.length; i++) {

            const travail = travaux[i];
            console.log('Travail:', travail);
            // Récupération de l'élément du DOM qui accueillera le travail
            const galleryTravaux = document.querySelector('.gallery');
            console.log('Div class="gallery" trouvée:', galleryTravaux);
            // Création d'une fiche dédiée à un travail
            const ficheTravail = document.createElement('figure');
            // Création des balises nécessaires
            const imageTravail = document.createElement('img');
            imageTravail.src = travail.imageUrl;
            const nomTravail =  document.createElement('figcaption');
            nomTravail.innerText = travail.title;
            // Création de la balise catégorie pour la gérer sans l'afficher
            const catTravail = document.createElement("p");
            // catTravail.innerText = travail.category.name;

            // On rattache la balise fiche à la section Travaux
            galleryTravaux.appendChild(ficheTravail);
            ficheTravail.appendChild(imageTravail);
            ficheTravail.appendChild(nomTravail);
            ficheTravail.appendChild(catTravail);
        }
    }
    // Affichage des fiches
    genererFiche(travaux);


// Création des boutons de tri
    // Récupération des catégories depuis le back-end
    const reponseCat = await fetch('http://localhost:5678/api/categories')
    console.log('Réponse Catégories :', reponseCat);
    const categories = await reponseCat.json();
    console.log('Récupération Catégories :', categories);

    // Génération des boutons de tri
    function genererBtnTri(categories) {
        for (let i = 0; i < categories.length; i++) {

            const categorie = categories.name[i];
            console.log('Catégories :', categorie);
            // Récupération de l'élément du DOM qui accueillera le travail
            const boutonsTri = document.querySelector('.portfolio')
        }
    }
