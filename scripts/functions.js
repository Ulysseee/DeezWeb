const STORAGE_KEY = 'deezer:favorites';

// Fonction pour récupérer depuis le Storage du navigateur
function getFavoritesFromStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Fonction pour sauvegarder dans le Storage du navigateur
function saveFavoritesToStorage(favoritesArray = []) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesArray));
}

// Fonction permettant de générer une liste de musiques (sous forme de card) dans le DOM
function addSongs(songArray, $targetElement) {
    const FAVORITES = getFavoritesFromStorage();

    let htmlContent = songArray.map(song => {
        const isInFavorites = FAVORITES.some(item => item.id === song.id);

        return `<div class="col mb-4">
                    <div class="card song" data-song-id="${song.id}">
                        <div class="row no-gutters">
                            <div class="col-md-5">
                                <img src="${song.album.cover_big}" class="card-img" alt="${song.album.title}">
                            </div>
                            <div class="col-md-7">
                                <div class="card-body">
                                    <h5 class="card-title">${song.title_short}</h5>
                                    <p class="card-text">${song.artist.name} / ${song.album.title}</p>
                                    ${isInFavorites
                                        ? `<button class="fav-button btn btn-sm btn-outline-danger" title="Retirer des favoris"><i class="em-svg em-heart" aria-role="presentation" aria-label="HEAVY BLACK HEART"></i></button>`
                                        : `<button class="fav-button btn btn-sm btn-outline-danger" title="Ajouter aux favoris"><i class="em-svg em-white_circle" aria-role="presentation" aria-label="MEDIUM WHITE CIRCLE"></i></button>`
                                    }
                                    <button class="play-button btn btn-sm btn-info" title="Écouter un extrait" data-file="${song.preview}">Écouter</button>
                                    <a href="${song.link}" class="stretched-link" target="_blank" title="Écouter sur Deezer.com">Écouter sur Deezer.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    });

    $targetElement.append(htmlContent);
}

// Fonction appelée dès qu'on lance une lecture <audio>
function onPlay() {
    const $playerContainer = $('#player-container');
    const $iconMusic = $playerContainer.children('.music');
    const $link = $playerContainer.children('a');
    const $player = $playerContainer.children('audio');

    let songFile = $(this).attr('data-file');
    let songLink = $(this).siblings('a.stretched-link').attr('href');
    let songTitle = $(this).siblings('h5.card-title').text().trim();
    songTitle = (songTitle.length > 40) ? `${songTitle.slice(0, 40)}…` : songTitle;

    $playerContainer
        .removeClass('d-none')
        .addClass('d-flex pulse-once')
        .one('animationend', function () {
            $(this).removeClass('pulse-once');
        });

    $player.attr('src', songFile).prop('autoplay', true);
    $link.attr('href', songLink).text(songTitle);
    $iconMusic.addClass('music-animated');
}

// Fonction appelée dès que le player <audio> est mit en pause
function onTogglePlayPause() {
    const $playerContainer = $('#player-container');
    const $iconMusic = $playerContainer.children('.music');
    const $player = $playerContainer.children('audio');

    if ($player.prop('paused') === true) {
        $iconMusic.removeClass('music-animated');
    } else {
        $iconMusic.addClass('music-animated');
    }
}
