var currentPage = new Number(1);

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDUzZTM3YjA0N2EzMGE4ZTk5MDgxNmQ2ODEzYmZhMyIsIm5iZiI6MTczODA2MTU5MC4yNzEwMDAxLCJzdWIiOiI2Nzk4YjcxNjcwMmY0OTJmNDc4ZjdjZDYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vX3GiU1-gkhCN-Y4HLuF2SnQI-i6Z1WS0uzbG5n814M';

var moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
var favTvsUrl = `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}&sort_by=created_at.asc`;
var tvsUrl = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`
var personsUrl = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;
var favMoviesUrl = `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc`;
var TRMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
var TRTvsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

var allCards = []; // all cards to be rendered will be here 

async function fetchResults(url) {//fetching function to get cards from TMDB API 
    try {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching  data:", error);
        return [];
    }
}
function processPageData(type, imgPathName, cardTitileName, dateName, isSearching, isBlured) {
    const cardsList = document.getElementById("cards");
    if (!isSearching) {
        fetchResults(window[`${type}sUrl`]).then(cards => {
            if (!cards || cards.length === 0) {
                console.log(`No ${type} found`);
                alert(`No ${type} found`)
                if (allCards.length > 0) {//if user loaded more but ther is no more we should render the old cards
                    renderCards(allCards, isSearching, isBlured);
                }
                return;
            }
            if (type === 'person') {//if we are in the popular people we only store the men for less storage
                cards = cards.filter(card => card.gender !== 1);
            }
            allCards = [...allCards, ...cards];
            console.log(allCards);
            renderCards(allCards, isSearching, isBlured);
        });
    }
    else {
        renderCards(allCards, isSearching, isBlured);
    }

    function renderCards(allCards, isSearching, isBlured) {//renders the cards based user searching or not 
        cardsList.innerHTML = "";//clear the DOM each call preventing dublicated data
        allCards.forEach(card => {
            if (isSearching) {
                if (card[cardTitileName].toLowerCase().includes(searchKeywoard())) {
                    drawCard(card, isBlured);
                }
            }
            else {
                drawCard(card, isBlured);
            }
        });
    }

    function drawCard(card, isBlured) {//displays each card details based on type of the card
        const carditem = document.createElement('div'); // Create a new card for each object
        carditem.classList.add("card");
        if (isBlured) {
            carditem.classList.add("blured");
        }
        if (type === "person") {// the person don't have date atterbute so the popularity is shown instead
            let popularity = Math.min((card.popularity / 250) * 100, 100);
            carditem.innerHTML += `
            <a href="card.html?id=${card.id}&type=${type}">
                <img src="https://image.tmdb.org/t/p/w500/${card[imgPathName]}" alt="${card[cardTitileName]}">
            </a>
            <p>${card[cardTitileName]}</p>
            <p id="departmen">${card.known_for_department}<span id="popularity"> ${popularity.toFixed(1)}%</span></p>
            <div class="popularity-bar">
            <div class="popularity-container">
            <div class="popularity-bar"></div>
            </div>
            `;
        }
        else {
            carditem.innerHTML += `
                    <a href="card.html?id=${card.id}&type=${type}">
                        <img src="https://image.tmdb.org/t/p/w500/${card[imgPathName]}" alt="${card[cardTitileName]}">
                    </a>
                    <p>${card[cardTitileName]}</p>
                    <p id="date">${new Date(card[dateName]).toDateString()}</p>  
                `;
        }
        cardsList.appendChild(carditem);
    }
}
function managePageState(isLoadingMore = false, isSearching = false) {
    if (isLoadingMore) {
        currentPage++;
        personsUrl = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;
        moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
        TRMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
        favMoviesUrl = `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc`;
        tvsUrl = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`
        TRTvsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;
        favTvsUrl = `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}&sort_by=created_at.asc`;
    }
    if (type === "movies") {
        processPageData('movie', 'poster_path', 'title', 'release_date', isSearching, true);
    }
    else if (type === "favMovies") {
        processPageData('favMovie', 'poster_path', 'title', 'release_date', isSearching, false)
    }
    else if (type === "TRMovies") {
        processPageData('TRMovie', 'poster_path', 'title', 'release_date', isSearching, true)
    }
    else if (type === "tvs") {
        processPageData('tv', 'poster_path', 'name', 'first_air_date', isSearching, true);
    }
    else if (type === "favTvs") {
        processPageData('favTv', 'poster_path', 'name', 'first_air_date', isSearching, false);
    }
    else if (type === "TRTvs") {
        processPageData('TRTv', 'poster_path', 'name', 'first_air_date', isSearching, true);
    }

    else if (type === "persons") {
        processPageData('person', 'profile_path', 'name', 'known_for_department', isSearching, false);
    }
}
function searchKeywoard() {
    const searchItem = document.getElementById("search");
    const keywoard = searchItem.value;
    return keywoard.toLowerCase().trim();
}

const search = document.getElementById("search");
search.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        managePageState(false, true);
    }


})
document.addEventListener('DOMContentLoaded', function () {
    managePageState();
});

