// Création de la constante ApiUrl pour l'URL de l'API
const ApiUrl = 'http://localhost:5678/api';

// Écoute d'événement pour le formulaire de connexion
    document.getElementById('login').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
    // Envoi des informations d'identification vers le back-end
        fetch(`${ApiUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then((reponse) => reponse.json())
        .then((data) => {
            if (data.error) {
                console.log('Erreur de connexion');
                document.getElementById('error-message').innerHTML = '<i class=\"fa-solid fa-triangle-exclamation\"></i><p>Informations de connexion incorrectes</p>';
            } else {
                console.log('Connexion réussie');
                // On stocke le token et le userId dans le stockage local ou une variable
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                // On dirige l'utilisateur vers la page d'accueil
                window.location.href = 'index.html';
            }    
        })
        .catch((error) => console.error('Mauvaise connexion', error));
})