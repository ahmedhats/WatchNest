const apiKey = '2d53e37b047a30a8e990816d6813bfa3';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");

// query string choosed type arrays
const mediaTypes = ["movie", "TRMovie", "favMovie", "tv", "TRTv", "favTv"];
const personTypes = ["person"];

const mediaUrl =
  (type === "movie" || type === "TRMovie" || type === "favMovie")
    ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;

const personUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;

const cardItem = document.getElementById("card");

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Error fetching data.");
    return;
  }
  return await response.json();
}

if (mediaTypes.includes(type)) {
  fetchData(mediaUrl).then(media => {
    console.log(media);
    // Use movie.title or tv.name basen on valdity 
    const title = media.title || media.name;
    const releaseDate = media.release_date || media.first_air_date || "Unknown";
    const runtime = media.runtime
      ? media.runtime + " mins"
      : media.episode_run_time
        ? media.episode_run_time[0] + " mins"
        : "N/A";
    const tagline = media.tagline ? `"${media.tagline}"` : "";
    const genres = media.genres ? media.genres.map(g => g.name).join(", ") : "";
    const backdrop = media.backdrop_path
      ? `https://image.tmdb.org/t/p/w500/${media.backdrop_path}`
      : "";
    const poster = media.poster_path
      ? `https://image.tmdb.org/t/p/w500/${media.poster_path}`
      : "";
    const overview = media.overview || "";
    // Calculate a popularity percentage (max at 100%)
    const computedScore = Math.min(Math.round((media.vote_average / 10) * 100), 100);

    cardItem.innerHTML = `
    <div class="media-details" style="background-image: url('${backdrop}');">
    <div class="overlay"></div>
    <div class="media-content">
    <div class="poster">
    <img src="${poster}" alt="${title}">
    <div class="popularity">
    <div class="circular-progress" style="--percentage: ${computedScore};">
    <span>${computedScore}%</span>
    </div>
    <p>Popularity</p>
    </div>
    </div>
    <div class="details">
    <h1 class="title">${title}</h1>
    <p class="tagline">${tagline}</p>
    <p class="release-date"><strong>Release Date:</strong> ${releaseDate}</p>
    ${runtime !== "N/A" ? `<p class="runtime"><strong>Runtime:</strong> ${runtime}</p>` : ""}
    ${genres ? `<p class="genres"><strong>Genres:</strong> ${genres}</p>` : ""}
    <p class="overview">${overview}</p>
    </div>
    </div>
    </div>
    `;
    document.body.style.backgroundImage = `url('${backdrop}')`;
    if (!(type.includes("fav"))) {
      cardItem.classList.add("blured");
      let elements = document.getElementsByClassName("overlay");
      elements[0].style.setProperty('background-color', 'rgba(0, 0, 0, 0.97)', 'important');
    } 
  });
}
else if (personTypes.includes(type)) {
  fetchData(personUrl).then(person => {
    console.log(person);
    cardItem.innerHTML = `
      <div class="person-details">
        <div class="person-content">
          <div class="profile">
            <img src="https://image.tmdb.org/t/p/w500/${person.profile_path}" alt="${person.name}">
          </div>
          <div class="person-info">
            <h1 class="title">${person.name}</h1>
            <p class="biography">${person.biography}</p>
            <ul class="person-details-list">
              ${person.birthday ? `<li><strong>Birthday:</strong> ${person.birthday}</li>` : ""}
              ${person.place_of_birth ? `<li><strong>Place of Birth:</strong> ${person.place_of_birth}</li>` : ""}
              ${person.known_for_department ? `<li><strong>Department:</strong> ${person.known_for_department}</li>` : ""}
              ${person.also_known_as && person.also_known_as.length ? `<li><strong>Also Known As:</strong> ${person.also_known_as.join(", ")}</li>` : ""}
            </ul>
            <p class="popularity"><strong>Popularity:</strong> ${person.popularity}</p>
          </div>
        </div>
      </div>
    `;
    // document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${person.profile_path}')`;
  });
}