var currentPage = new Number(1);
let lastScrollTop = 0;
const navbar = document.getElementById("nav");
const cardsList = document.getElementById("cards");
var sortBy = 'vote_average.desc';
var filterBy = '';
// popularity.desc  popularity.asc  vote_average.desc  vote_average.asc   original_title.desc   original_title.asc

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");
const searchVal = urlParams.get("searchVal");
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDUzZTM3YjA0N2EzMGE4ZTk5MDgxNmQ2ODEzYmZhMyIsIm5iZiI6MTczODA2MTU5MC4yNzEwMDAxLCJzdWIiOiI2Nzk4YjcxNjcwMmY0OTJmNDc4ZjdjZDYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vX3GiU1-gkhCN-Y4HLuF2SnQI-i6Z1WS0uzbG5n814M';

const urls = {
    movies: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}&with_genres=${filterBy}`,
    popMovies: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`,
    TRMovies: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`,
    favMovies: `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}`,
    tvs: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}&with_genres=${filterBy}`,
    popTvs: `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`,
    TRTvs: `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`,
    favTvs: `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}`,
    persons: `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`,
    alls: `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${searchVal}&language=en-US&page=${currentPage}`
    // searchMovies: `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=${currentPage}&query=${searchQuery}`,
    // searchTV: `https://api.themoviedb.org/3/search/tv?language=en-US&page=${currentPage}&query=${searchQuery}`,
    // searchPersons: `https://api.themoviedb.org/3/search/person?language=en-US&page=${currentPage}&query=${searchQuery}`
    //links for searching the whole database
};



const search = document.getElementById("search");
const searchIcon = document.getElementById("searchIcon");
const colorModeBtn = document.getElementById("light");
const LoadMoreBtn = document.getElementById("loadMore");

const sortList = document.getElementById("sort-dropdown");
const sortAnchorTag = document.getElementById("sortBtn");
const populartityD = document.getElementById("populartityD");
const populartityA = document.getElementById("populartityA");
const ratingD = document.getElementById("ratingD");
const ratingA = document.getElementById("ratingA");
const nameAZ = document.getElementById("nameAZ");
const nameZA = document.getElementById("nameZA");

const filterList = document.getElementById("filter-dropdown");
const filterAnchorTag = document.getElementById("filterBtn");
const allG = document.getElementById("allG");
const action = document.getElementById("action");
const animation = document.getElementById("animation");
const comedy = document.getElementById("comedy");
const drama = document.getElementById("drama");
const crime = document.getElementById("crime");
const fantasy = document.getElementById("fantasy");
const family = document.getElementById("family");

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
    const urlKey = `${type}s`;
    if (!isSearching) {
        fetchResults(urls[urlKey]).then(cards => {
            console.log(cards);
            if (!cards || cards.length === 0) {
                console.log(`No ${type} found`);
                alert(`No ${type} found`)
                if (allCards.length > 0) {//if user loaded more but there is no more we should render the old cards
                    renderCards(allCards);
                }
                return;
            }
            if (type === 'person' || type === 'all') {//if we are in the popular people or in all we only store the men for less storage
                cards = cards.filter(card => card.gender !== 1);
            }
            allCards = [...allCards, ...cards];
            console.log(allCards);
            renderCards(allCards);
        });
    }
    else {
        renderCards(allCards);
    }

    function renderCards(allCards) {//renders the cards based user searching or not 
        cardsList.innerHTML = "";//clear the DOM each call preventing dublicated data
        allCards.forEach(card => {
            if (isSearching) {
                if (type === 'all') {
                    if (handleMixedSearchPage(card)) {
                        drawMixedCard(card);
                    }

                }
                else if (card[cardTitileName].toLowerCase().includes(searchKeywoard())) {
                    drawCard(card, isBlured);
                }
            }
            else {
                if (type === 'all') {
                    drawMixedCard(card);
                }
                else {
                    drawCard(card, isBlured);
                }
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
            <p id="departmen">Dept:${card.known_for_department}<span id="popularity"> / popularity: ${popularity.toFixed(1)}%</span></p>
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

function handleMixedSearchPage(card) {
    let title = '';
    if (card.media_type === "movie") {
        title = card.title || "";
    }
    else {
        title = card.name || "";
    }
    return title.toLowerCase().includes(searchKeywoard())
}

function drawMixedCard(card) {
    const carditem = document.createElement('div');
    carditem.classList.add("card");
    // Determine link, image URL, title, and extra info based on media type.
    let linkUrl = `card.html?id=${card.id}&type=${card.media_type}`;
    let imgUrl = '';
    let title = '';
    let extraInfo = '';

    if (card.media_type === "movie") {
        title = card.title || "";
        imgUrl = card.poster_path
            ? `https://image.tmdb.org/t/p/w500/${card.poster_path}`
            : '../IMG/NoImg.jpg';
        // Use release date if available
        extraInfo = card.release_date ? new Date(card.release_date).toDateString() : "";
        carditem.classList.add("blured");
    } else if (card.media_type === "tv") {
        title = card.name || "";
        imgUrl = card.poster_path
            ? `https://image.tmdb.org/t/p/w500/${card.poster_path}`
            : '../IMG/NoImg.jpg';
        extraInfo = card.first_air_date ? new Date(card.first_air_date).toDateString() : "";
        carditem.classList.add("blured");
    } else if (card.media_type === "person") {
        title = card.name || "";
        imgUrl = card.profile_path
            ? `https://image.tmdb.org/t/p/w500/${card.profile_path}`
            : '../IMG/NoImg.jpg';
        let popularity = Math.min((card.popularity / 250) * 100, 100);
        extraInfo = `Dept: ${card.known_for_department || "N/A"} / Popularity: ${popularity.toFixed(1)}%`;
    }

    let innerHTML = `
      <a href="${linkUrl}">
        <img src="${imgUrl}" alt="${title}" onerror="this.onerror=null; this.src='../IMG/NoImg.jpg';">
      </a>
      <p>${title}</p>
    `;
    if (extraInfo) {
        innerHTML += `<p class="extraInfo">${extraInfo}</p>`;
    }

    carditem.innerHTML = innerHTML;
    cardsList.appendChild(carditem);
}


function managePageState(isLoadingMore = false, isSearching = false, isSorting = false, isFiltering = false) {
    applyTheme(localStorage.getItem('theme'));
    if (isLoadingMore || isSorting || isFiltering) {
        if (isLoadingMore) {
            currentPage++;
        }
        else {
            currentPage = 1;
            allCards = [];
        }
        urls.movies = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}&with_genres=${filterBy}`;
        urls.popMovies = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`;
        urls.favTvs = `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=${currentPage}`;
        urls.tvs = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=${sortBy}&with_genres=${filterBy}`;
        urls.popTvs = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${currentPage}`;
        urls.persons = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;
        urls.favMovies = `https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=${currentPage}`;
        urls.TRMovies = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
        urls.TRTvs = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;
        urls.alls = `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${searchVal}&language=en-US&page=${currentPage}`;
    }

    if (type === "movies") {
        processPageData('movie', 'poster_path', 'title', 'release_date', isSearching, true);
    }
    else if (type === "popMovies") {
        processPageData('movie', 'poster_path', 'title', 'release_date', isSearching, true);
        noSortFilter()
    }
    else if (type === "favMovies") {
        processPageData('favMovie', 'poster_path', 'title', 'release_date', isSearching, false);
        noSortFilter()
    }
    else if (type === "TRMovies") {
        processPageData('TRMovie', 'poster_path', 'title', 'release_date', isSearching, true);
        noSortFilter()
    }
    else if (type === "tvs") {
        processPageData('tv', 'poster_path', 'name', 'first_air_date', isSearching, true);
    }
    else if (type === "popTvs") {
        processPageData('tv', 'poster_path', 'name', 'first_air_date', isSearching, true);
        noSortFilter()
    }
    else if (type === "favTvs") {
        processPageData('favTv', 'poster_path', 'name', 'first_air_date', isSearching, false);
        noSortFilter()
    }
    else if (type === "TRTvs") {
        processPageData('TRTv', 'poster_path', 'name', 'first_air_date', isSearching, true);
        noSortFilter()
    }

    else if (type === "persons") {
        processPageData('person', 'profile_path', 'name', 'known_for_department', isSearching, false);
        noSortFilter()
    }
    else if (type === "all") {
        processPageData('all', 'poster_path', 'title', 'release_date', isSearching, true);
        noSortFilter()
    }
}
function searchKeywoard() {
    const searchItem = document.getElementById("search");
    const keywoard = searchItem.value;
    return keywoard.toLowerCase().trim();
}

function noSortFilter() {
    sortAnchorTag.title = 'sorting is only available in discover section :(';
    filterAnchorTag.title = 'filtering is only available in discover section :(';
    sortList.remove();
    filterList.remove();
}


function renderPage() {
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

    searchIcon.addEventListener('click', () => {
        managePageState(false, true);
    });

    colorModeBtn.addEventListener("click", () => {
        toggleTheme();
    });

    LoadMoreBtn.addEventListener('click', () => {
        managePageState(true);
    });


    populartityD.addEventListener('click', () => {
        sortBy = 'popularity.desc';
        managePageState(false, false, true)
    });
    populartityA.addEventListener('click', () => {
        sortBy = 'popularity.asc';
        managePageState(false, false, true)
    });
    ratingD.addEventListener('click', () => {
        sortBy = 'vote_average.desc';
        managePageState(false, false, true)
    });
    ratingA.addEventListener('click', () => {
        sortBy = 'vote_average.asc';
        managePageState(false, false, true)
    });
    nameAZ.addEventListener('click', () => {
        if (type === 'movies' || type === 'tvs') {
            sortBy = 'original_title.desc';
            managePageState(false, false, true)
        }
        else {
            //sorting logic
        }
    });
    nameZA.addEventListener('click', () => {
        if (type === 'movies' || type === 'tvs') {
            sortBy = 'original_title.asc';
            managePageState(false, false, true)
        }
        else {
            //reversed sorting logic
        }
    });

    allG.addEventListener('click', () => {
        filterBy = '';
        managePageState(false, false, false, true);
    });
    action.addEventListener('click', () => {
        filterBy = '10759';
        managePageState(false, false, false, true);
    });
    animation.addEventListener('click', () => {
        filterBy = '16';
        managePageState(false, false, false, true);
    });
    comedy.addEventListener('click', () => {
        filterBy = '35';
        managePageState(false, false, false, true);
    });
    drama.addEventListener('click', () => {
        filterBy = '18';
        managePageState(false, false, false, true);
    });
    crime.addEventListener('click', () => {
        filterBy = '80';
        managePageState(false, false, false, true);
    });
    fantasy.addEventListener('click', () => {
        filterBy = '10765';
        managePageState(false, false, false, true);
    });
    family.addEventListener('click', () => {
        filterBy = '10751';
        managePageState(false, false, false, true);
    });

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY;

        if (scrollTop > lastScrollTop) {
            navbar.style.top = "-150px";
        } else {
            navbar.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });
}
renderPage();
// sorting a-z for other types cleaning the code 