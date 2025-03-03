var currentPage = new Number(1);
var sortBy = 'vote_average.desc';
// popularity.desc  popularity.asc  vote_average.desc  vote_average.asc   original_title.desc   original_title.asc

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDUzZTM3YjA0N2EzMGE4ZTk5MDgxNmQ2ODEzYmZhMyIsIm5iZiI6MTczODA2MTU5MC4yNzEwMDAxLCJzdWIiOiI2Nzk4YjcxNjcwMmY0OTJmNDc4ZjdjZDYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vX3GiU1-gkhCN-Y4HLuF2SnQI-i6Z1WS0uzbG5n814M';

const urls = {
    movies: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}`,
    popMovies: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`,
    TRMovies: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`,
    favMovies: `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}`,
    tvs: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}`,
    popTvs: `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`,
    TRTvs: `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`,
    favTvs: `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}`,
    persons: `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`,
};


const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

const search = document.getElementById("search");
const colorModeBtn = document.getElementById("light");
const LoadMoreBtn = document.getElementById("loadMore");

const sortList = document.getElementById("sort-dropdown");
const populartityD = document.getElementById("populartityD");
const populartityA = document.getElementById("populartityA");
const ratingD = document.getElementById("ratingD");
const ratingA = document.getElementById("ratingA");
const nameAZ = document.getElementById("nameAZ");
const nameZA = document.getElementById("nameZA");

var allCards = []; // all cards to be rendered will be here 

import { applyTheme, toggleTheme } from '../JS/home.js';
import { getCookie } from '../JS/auth.js';

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
        console.log(data);
        return data.results;
    } catch (error) {
        console.error("Error fetching  data:", error);
        return [];
    }
}
function processPageData(type, imgPathName, cardTitileName, dateName, isSearching, isBlured) {
    const cardsList = document.getElementById("cards");
    if (!isSearching) {
        fetchResults(urls[`${type}s`]).then(cards => {
            if (!cards || cards.length === 0) {
                console.log(`No ${type} found`);
                alert(`No ${type} found`)
                if (allCards.length > 0) {//if user loaded more but there is no more we should render the old cards
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
                <img src="https://image.tmdb.org/t/p/w500/${card[imgPathName]}" onerror="this.onerror=null; this.src='../IMG/NoImg.jpg';" alt="${card[cardTitileName]}">
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
                        <img src="https://image.tmdb.org/t/p/w500/${card[imgPathName]}" onerror="this.onerror=null; this.src='../IMG/NoImg.jpg';" alt="${card[cardTitileName]}">
                    </a>
                    <p>${card[cardTitileName]}</p>
                    <p id="date">${new Date(card[dateName]).toDateString()}</p>  
                `;
        }
        cardsList.appendChild(carditem);
    }
}
function managePageState(isLoadingMore = false, isSearching = false, sortVal = '') {
    applyTheme(localStorage.getItem('theme'));
    if (isLoadingMore || sortVal) {
        if (isLoadingMore) {
            currentPage++;
        }
        else {
            sortBy = sortVal;
            currentPage = 1;
            allCards = [];
        }
        urls.movies = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        popMovies = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`;
        urls.favTvs = `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        urls.tvs = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        popTvs = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`;
        urls.persons = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        urls.favMovies = `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        urls.TRMovies = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}&sort_by=${sortBy}`;
        urls.TRTvs = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}&sort_by=${sortBy}`;
    }
    // if (type.includes('ovies')) {
    //     processPageData(type.slice(0, -1), 'poster_path', 'title', 'release_date', isSearching, true);
    // }
    // else {
    //     processPageData(type.slice(0, -1), 'poster_path', 'name', 'first_air_date', isSearching, false);

    // }
    if (type === "movies") {
        processPageData('movie', 'poster_path', 'title', 'release_date', isSearching, true);
    }
    else if (type === "popMovies") {
        processPageData('movie', 'poster_path', 'title', 'release_date', isSearching, true);
    }
    else if (type === "favMovies") {
        processPageData('favMovie', 'poster_path', 'title', 'release_date', isSearching, false);
        sortList.style.display = 'none';
    }
    else if (type === "TRMovies") {
        processPageData('TRMovie', 'poster_path', 'title', 'release_date', isSearching, true);
        sortList.style.display = 'none';
    }
    else if (type === "tvs") {
        processPageData('tv', 'poster_path', 'name', 'first_air_date', isSearching, true);
    }
    else if (type === "popTvs") {
        processPageData('tv', 'poster_path', 'name', 'first_air_date', isSearching, true);
    }
    else if (type === "favTvs") {
        processPageData('favTv', 'poster_path', 'name', 'first_air_date', isSearching, false);
        sortList.style.display = 'none';
    }
    else if (type === "TRTvs") {
        processPageData('TRTv', 'poster_path', 'name', 'first_air_date', isSearching, true);
        sortList.style.display = 'none';
    }

    else if (type === "persons") {
        processPageData('person', 'profile_path', 'name', 'known_for_department', isSearching, false);
        sortList.style.display = 'none';
    }
}
function searchKeywoard() {
    const searchItem = document.getElementById("search");
    const keywoard = searchItem.value;
    return keywoard.toLowerCase().trim();
}

window.addEventListener('load', () => {
    if (getCookie('loggedIn') !== 'true') {
        window.location.href = '../HTML/index.html';// Redirect to home page if cookie found to be looged in :)
    }
});

document.addEventListener('DOMContentLoaded', function () {
    managePageState();
});

search.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        managePageState(false, true);
    }
})

colorModeBtn.addEventListener("click", () => {
    toggleTheme();
});

LoadMoreBtn.addEventListener('click', () => {
    managePageState(true);
});


populartityD.addEventListener('click', () => {
    managePageState(false, false, 'popularity.desc')
});
populartityA.addEventListener('click', () => {
    managePageState(false, false, 'popularity.asc')
});
ratingD.addEventListener('click', () => {
    managePageState(false, false, 'vote_average.desc')
});
ratingA.addEventListener('click', () => {
    managePageState(false, false, 'vote_average.asc')
});
nameAZ.addEventListener('click', () => {
    if (type === 'movies') {
        managePageState(false, false, 'original_title.desc')
    }
    else {
        //sorting logic
    }
});
nameZA.addEventListener('click', () => {
    if (type === 'movies') {
        managePageState(false, false, 'original_title.asc')
    }
    else {
        //reversed sorting logic
    }
});