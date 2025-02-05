var currentPage = 1;

const apiKey = '2d53e37b047a30a8e990816d6813bfa3';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDUzZTM3YjA0N2EzMGE4ZTk5MDgxNmQ2ODEzYmZhMyIsIm5iZiI6MTczODA2MTU5MC4yNzEwMDAxLCJzdWIiOiI2Nzk4YjcxNjcwMmY0OTJmNDc4ZjdjZDYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vX3GiU1-gkhCN-Y4HLuF2SnQI-i6Z1WS0uzbG5n814M';

// can i use const and access it from script instead of using var and access it throw window ?
var moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
var tvsUrl = `https://api.themoviedb.org/3/account/21780644/favorite/tv?language=en-US&page=1&sort_by=created_at.asc`;
var tvALsUrl = `https://api.themoviedb.org/3/account/21780644/lists?page=1`;
var personsUrl = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;
var favMoviesUrl = 'https://api.themoviedb.org/3/account/21780644/favorite/movies?language=en-US&page=1&sort_by=created_at.asc';
var TRMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
var TRTvsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");


async function fetchResults(url) {
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
        console.error("Error fetching TV series:", error);
        return [];
    }
}
function click(type, imgPathName, cardTitileName, dateName, isLoadingMore, isSearching, isBlured) {
    const cardsList = document.getElementById("cards");
    if (!isLoadingMore) {
        cardsList.innerHTML = ""; // Clear previous results before adding new ones
    }

    fetchResults(window[`${type}sUrl`]).then(cards => {
        if (!cards || cards.length === 0) {
            console.log(`No ${type} found`);
            return;
        }

        console.log(cards);
        cards.forEach(card => {
            if (!(type === 'person' && card.gender === 1)) {
                if (isSearching) {
                    if (card[cardTitileName].toLowerCase().includes(searchKeywoard())) {
                        drawCard(card, isBlured);
                    }
                }
                else {
                    drawCard(card, isBlured);
                }
            }
        });
    });

    function drawCard(card, isBlured) {
        const carditem = document.createElement('div'); // Create a new card for each movie
        carditem.classList.add("card");
        if (isBlured) {
            carditem.classList.add("blured");
        }
        carditem.innerHTML = `
                <a href="card.html?id=${card.id}&type=${type}">
                    <img src="https://image.tmdb.org/t/p/w500/${card[imgPathName]}" alt="${card[cardTitileName]}">
                </a>
                <p>${card[cardTitileName]}</p>
                <p id="date">${new Date(card[dateName]).toDateString()}</p>  
            `;
        cardsList.appendChild(carditem);
    }
}
function handleClick(isLoadingMore = false, isSearching = false) {
    if (isLoadingMore) {
        currentPage++;
        personsUrl = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currentPage}`;
        moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
        TRMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
        TRTvsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;
    }
    if (type === "movies") {
        click('movie', 'poster_path', 'title', 'release_date', isLoadingMore, isSearching, true);
    }
    else if (type === "favMovies") {
        click('favMovie', 'poster_path', 'title', 'release_date', isLoadingMore, isSearching, false)
    }
    else if (type === "TRMovies") {
        click('TRMovie', 'poster_path', 'title', 'release_date', isLoadingMore, isSearching, true)
    }
    else if (type === "tvs") {
        click('tv', 'poster_path', 'name', 'first_air_date', isLoadingMore, isSearching, false);
    }
    else if (type === "tvALs") {
        click('tvAL', 'poster_path', 'name', 'first_air_date', isLoadingMore, isSearching, false);
    }
    else if (type === "TRTvs") {
        click('TRTv', 'poster_path', 'name', 'first_air_date', isLoadingMore, isSearching, true);
    }

    else if (type === "persons") {
        click('person', 'profile_path', 'name', 'date', isLoadingMore, isSearching, false);
    }
}
function searchKeywoard() {
    const searchItem = document.getElementById("search");
    const keywoard = searchItem.value;
    return keywoard.toLowerCase().trim();
}

