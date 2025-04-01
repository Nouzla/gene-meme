const imageUpload = document.getElementById('imageUpload');
const textInput = document.getElementById('textMeme');
const ajouterTexteBtn = document.getElementById('ajouterTexte');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let image = new Image(); // Pour stocker l'image uploadée

// Écouteur pour l'upload d'image
imageUpload.addEventListener('change', function(event) {
    const fichier = event.target.files[0];

    if (fichier) {
        const lecteur = new FileReader();
        lecteur.onload = function(e) {
            image.src = e.target.result; // Définir la source de l'image
        };
        lecteur.readAsDataURL(fichier); // Convertir l'image en URL utilisable
    }
});

// Une fois l'image chargée, ajuster le canvas et afficher l'image
image.onload = function() {
    // Ajuste la taille du canvas pour correspondre à l'image (ici, on réduit de moitié)
    canvas.width = image.width / 2;
    canvas.height = image.height / 2;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// Écouteur pour ajouter le texte sur le mème
ajouterTexteBtn.addEventListener('click', function() {
    if (!image.src) {
        alert("Ajoutez d'abord une image !");
        return;
    }

    // Redessine l'image sur le canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Configuration du style du texte
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    // Récupère le texte saisi par l'utilisateur
    let texte = textInput.value;
    let x = canvas.width / 2;
    let y = 50; // Position en haut du canvas

    // Dessine le texte avec un contour pour une meilleure visibilité
    ctx.strokeText(texte, x, y);
    ctx.fillText(texte, x, y);
});
// ... (code existant pour image, texte, canvas)

const telechargerBtn = document.getElementById('telechargerMeme');

telechargerBtn.addEventListener('click', function() {
    // Vérifie d'abord que le canvas contient bien une image (en vérifiant par exemple que le canvas a une taille non nulle)
    if (canvas.width === 0 || canvas.height === 0) {
        alert("Aucune image à télécharger !");
        return;
    }

    // Crée un élément <a> pour lancer le téléchargement
    const lien = document.createElement('a');
    lien.download = 'meme.png';
    // Convertit le canvas en URL de type image/png
    lien.href = canvas.toDataURL('image/png');
    // Simule un clic pour démarrer le téléchargement
    lien.click();
});
document.getElementById('partagerFacebook').addEventListener('click', function() {
    partagerMeme('facebook');
});

document.getElementById('partagerTwitter').addEventListener('click', function() {
    partagerMeme('twitter');
});

document.getElementById('partagerWhatsApp').addEventListener('click', function() {
    partagerMeme('whatsapp');
});

function partagerMeme(reseau) {
    if (canvas.width === 0 || canvas.height === 0) {
        alert("Aucune image à partager !");
        return;
    }

    // Convertit l'image en URL
    const imageURL = canvas.toDataURL('image/png');

    // Crée un lien de partage selon le réseau
    let partageURL = '';
    if (reseau === 'facebook') {
        partageURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageURL)}`;
    } else if (reseau === 'twitter') {
        partageURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageURL)}&text=Regarde mon mème !`;
    } else if (reseau === 'whatsapp') {
        partageURL = `https://api.whatsapp.com/send?text=Regarde mon mème ! ${encodeURIComponent(imageURL)}`;
    }

    // Ouvre une nouvelle fenêtre pour partager
    window.open(partageURL, '_blank');
}
function sauvegarderMeme() {
    if (canvas.width === 0 || canvas.height === 0) {
        alert("Aucune image à sauvegarder !");
        return;
    }

    const imageData = canvas.toDataURL('image/png'); // Convertit le mème en image

    // Récupère la liste des mèmes existants
    let memes = JSON.parse(localStorage.getItem('memes')) || [];

    // Ajoute le nouveau mème
    memes.push(imageData);

    // Enregistre la liste mise à jour
    localStorage.setItem('memes', JSON.stringify(memes));

    // Met à jour la galerie
    afficherGalerie();
}

// Appelle cette fonction après la création ou le téléchargement d’un mème
document.getElementById('telechargerMeme').addEventListener('click', sauvegarderMeme);

function afficherGalerie() {
    const galerieDiv = document.getElementById('galerie');
    galerieDiv.innerHTML = ''; // Efface l’ancienne galerie

    const memes = JSON.parse(localStorage.getItem('memes')) || [];

    memes.forEach((meme, index) => {
        const img = document.createElement('img');
        img.src = meme;
        img.style.width = '150px';
        img.style.margin = '10px';
        img.addEventListener('click', () => afficherEnGrand(meme));

        const btnSupprimer = document.createElement('button');
        btnSupprimer.textContent = '🗑 Supprimer';
        btnSupprimer.addEventListener('click', () => supprimerMeme(index));

        const divMeme = document.createElement('div');
        divMeme.appendChild(img);
        divMeme.appendChild(btnSupprimer);

        galerieDiv.appendChild(divMeme);
    });
}

// Afficher la galerie au chargement de la page
document.addEventListener('DOMContentLoaded', afficherGalerie);
function supprimerMeme(index) {
    let memes = JSON.parse(localStorage.getItem('memes')) || [];
    memes.splice(index, 1); // Supprime le mème de la liste
    localStorage.setItem('memes', JSON.stringify(memes)); // Met à jour le stockage

    afficherGalerie(); // Rafraîchit la galerie
}
function afficherEnGrand(meme) {
    const fenetre = window.open();
    fenetre.document.write(`<img src="${meme}" style="width:100%;">`);
}