const FAVORITES = getFavoritesFromStorage();

const $favoritesContainer = $('#favorites');
const $player = $('#player-container audio');

// Lorsqu'on clique sur un bouton "favoris"
$favoritesContainer.on('click', '.fav-button', onRemoveFavorite);
// Lorsqu'on clique sur un bouton de lecture d'une .card
$favoritesContainer.on('click', '.play-button', onPlay);
// Lorsqu'on joue/stoppe la lecture du player <audio> de la .navbar
$player.on('play pause', onTogglePlayPause);

// Rendu du résultat
addSongs(FAVORITES, $favoritesContainer);

// Fonction appelée lorsqu'on supprime un favoris
function onRemoveFavorite() {
    // Récuperer l'id de la musique cliquée
    let $favButton = $(this);
    let $card = $favButton.parents('.song');
    let clickedSongID = $card.attr('data-song-id');
    clickedSongID = Number(clickedSongID);

    // Récupère l'index de l'élément cliqué dans le tableau de favoris
    let index = FAVORITES.findIndex(song => song.id === clickedSongID);

    if (index > -1) {
        // Retire la musique du tableau de favoris
        FAVORITES.splice(index, 1);
        // Sauvegarde du tableau dans le localStorage
        saveFavoritesToStorage(FAVORITES);
        // Suppression de la card dans le HTML
        $card.remove();
    }
}
