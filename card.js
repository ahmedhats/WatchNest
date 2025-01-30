const apiKey = '2d53e37b047a30a8e990816d6813bfa3';
// const id = window.location.search.split("=")[1];
// const type = window.location.search.split("=")[2];
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");
const Movieurl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
const Tvurl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;
const Personurl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;
const cardItem = document.getElementById("card");

async function fetchcard(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.log("fethcing error ");
    }
    const data = await response.json();
    console.log(data);
    console.log("Response status:", response.status);

    return data;
}
if (type === "movie") {
    // cardItem.innerHTML="";
    fetchcard(Movieurl).then(movie => {
        cardItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        `
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${movie.backdrop_path}')`;
        console.log(movie);
    });
}
else if (type === "tv") {
    // cardItem.innerHTML="";
    fetchcard(Tvurl).then(TvSerie => {
        cardItem.innerHTML =
            `<img src="https://image.tmdb.org/t/p/w500/${TvSerie.poster_path}" alt="${TvSerie.title}">
            <p>${TvSerie.overview}</p>`
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${TvSerie.backdrop_path}')`;
        console.log(TvSerie);
    });
}
else if (type === "person") {
    fetchcard(Personurl).then(person => {
        cardItem.innerHTML =
            `<img src="https://image.tmdb.org/t/p/w500/${person.profile_path}" alt="${person.title}">
            <p>${person.biography}</p>`
        //birthday
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${person.profile_path}')`;
        console.log(person);
    });
}

