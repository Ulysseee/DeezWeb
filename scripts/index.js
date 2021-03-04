const FAVORITES = getFavoritesFromStorage();

const $form = $('form');
const $searchInput = $('#searchText');
const $resultsContainer = $('#search-results');
const $results = $resultsContainer.children('.row');
const $sucess = $resultsContainer.children('.text-success');
const $error = $resultsContainer.children('.text-danger');
const $player = $('#player-container audio');

let nextURL = '';
let resultsLoaded = true;

// Lorsqu'on valide le formulalire
$form.submit(onFormSubmit);
// Lorsqu'on clique sur un bouton de mise en favoris
$results.on('click', '.fav-button', onToggleFavorite);
// Lorsqu'on scrolle dans la page
$(window).on('scroll', onScroll);
// Lorsqu'on clique sur un bouton de lecture d'une .card
$results.on('click', '.play-button', onPlay);
// Lorsqu'on joue/stoppe la lecture du player <audio> de la .navbar
$player.on('play pause', onTogglePlayPause);

function onFormSubmit (event) {
    event.preventDefault() // Empeche de recharger la page

    let searchValue = $searchInput.val();

    // Création et affichage d'un spinner
    $('.spinner').remove();
    const $spinner = $('<div class="spinner"></div>').appendTo('form');
                    
    // Requete Ajax vers le serveur d'API de Deezer
    $.ajax({
        url: `https://api.deezer.com/search?q=${searchValue}&output=jsonp`,
        dataType: 'jsonp'
    }).done(response => {
        //Suprime le spinner
        $spinner.remove();

        $resultsContainer.removeClass('d-none');
        $sucess.removeClass('d-none').children('strong').text(response.total);
        $results.empty();
        addSongs(response.data, $results);

       // On conserve l'URL pour la prochaine requête, que l'on fera au scroll en arrivant en bas de page
        nextURL = response.next;
        resultsLoaded = true;
    }).fail(({ status, statusText }) => {
        //Supprime le spinner
        $spinner.remove();
        //Affiche l'erreur
        $resultsContainer.removeClass('.d-none');
        $error.removeClass('d-none').children('strong').text(`${status} ${statusText}`);
    });
} 

function onToggleFavorite () {
    // Récuperer l'id de la musique cliquée
    let $favButton = $(this);
    let clickedSongID = $favButton.parents('.song').attr('data-song-id');
    clickedSongID = Number(clickedSongID);

    // Vérifie si cette musique n'est pas déjà dans les favoris
    let index = FAVORITES.findIndex(song => song.id === clickedSongID);

    if (index > -1) {
        // Si elle y est déjà, on l'en retire
        FAVORITES.splice(index, 1);
        // Sauvegarde le tableau mis à jour dans le local storage du navigateur
        saveFavoritesToStorage(FAVORITES);
        // Changement de l'état du bouton
        $favButton
            .text('⚪️')
            .attr('title', 'Ajouter aux favoris');
    } else {
        // Désactive temporairement le bouton, le temps que la requête Ajax se termine
        $favButton.text('...').addClass('disabled').prop('disabled', true)
        // Sinon, on l'ajoute en allant chercher sur l'API l'objet complet qu'on sauvegardera
        $.ajax({
            url: `https://api.deezer.com/track/${clickedSongID}/?output=jsonp`,
            dataType: 'jsonp'
        }).done(response => {
            FAVORITES.push(response)
            // Sauvegarde
            saveFavoritesToStorage(FAVORITES);
            // Changement de l'état du bouton
            $favButton
                .text('❤')
                .attr('title', 'Retirer des favoris')
                .removeClass('disabled')
                .prop('disabled', false);
        })
    }

    // Sinon, on l'ajoute en allant chercher sur l'API l'objet complet qu'on sauvegardera
}

function onScroll() {
    let positionAscenseur = Math.floor(window.scrollY);
    let hauteurTotalePage = document.documentElement.scrollHeight;
    let hauteurFenetre = window.innerHeight;

    if (positionAscenseur >= hauteurTotalePage - hauteurFenetre) {
        loadNextResults();
    }
}

function loadNextResults() {
    if (nextURL && resultsLoaded) {
        console.log('Page end! Loading next results...');

        // Création et affichage d'un spinner en bas de page
        const $spinner = $('<div class="spinner m-auto"></div>').appendTo($resultsContainer);

        resultsLoaded = false;
        $.ajax({
            url: nextURL,
            dataType: 'jsonp'
        }).done(response => {
            $spinner.remove();

            addSongs(response.data, $results);

            nextURL = response.next;
            resultsLoaded = true;
        });
    }
}
