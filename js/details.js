// details.js
// ==== TMDB Fetch (unchanged) ====
const API_KEY = "e5fa1dbace5c9c0c9b6cb22d747b4a91";
const BASE_URL = "https://api.themoviedb.org/3";
const posterBaseURL = "https://image.tmdb.org/t/p/w500";
const backdropBaseURL = "https://image.tmdb.org/t/p/original";

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type"); // "movie" or "tv"
const id = urlParams.get("id");

const titleEl = document.getElementById("title");
const genresEl = document.getElementById("genres");
const descEl = document.getElementById("description");
const posterEl = document.getElementById("poster");
const castListEl = document.getElementById("cast-list");
const trailerEl = document.getElementById("trailer");
const watchLaterBtn = document.getElementById("add-watch-later");
const favBtn = document.getElementById("add-favorites");
const toggleBtn = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
  navMenu.classList.toggle("show");
});
async function fetchDetails() {
  try {
    const resp = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );
    const data = await resp.json();
    if (!data || (!data.title && !data.name)) {
      return alert("Details not found!");
    }

    titleEl.textContent = data.title || data.name;
    descEl.textContent = data.overview;
    posterEl.src = posterBaseURL + data.poster_path;
    document.querySelector(".details-container").style.backgroundImage = `url(${
      backdropBaseURL + data.backdrop_path
    })`;

    // genres
    genresEl.innerHTML = data.genres
      .map((g) => `<span class="genre">${g.name}</span>`)
      .join("");

    // top 5 cast
    castListEl.innerHTML = data.credits.cast
      .slice(0, 5)
      .map(
        (a) => `
        <div class="cast-member">
          <img src="${
            a.profile_path
              ? posterBaseURL + a.profile_path
              : "./assets/no-image.png"
          }" alt="${a.name}" />
          <p>${a.name}</p>
        </div>
      `
      )
      .join("");

    // trailer
    const t = data.videos.results.find((v) => v.type === "Trailer");
    if (t) trailerEl.src = `https://www.youtube.com/embed/${t.key}`;
    else trailerEl.parentElement.style.display = "none";
  } catch (err) {
    console.error(err);
    alert("Error loading details.");
  }
}

// ==== LOCAL-STORAGE WatchLater / Favourites ====
function handleAdd(categoryKey) {
  const movie = {
    id,
    title: titleEl.textContent,
    posterPath: posterEl.src,
  };

  // decide which storage key
  const storageKey =
    categoryKey === "watchlater"
      ? type === "movie"
        ? "moviesWatchlater"
        : "tvWatchlater"
      : type === "movie"
      ? "moviesFavourites"
      : "tvFavourites";

  const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (list.some((m) => m.id === movie.id)) {
    return alert(`"${movie.title}" is already in your ${storageKey}.`);
  }
  list.push(movie);
  localStorage.setItem(storageKey, JSON.stringify(list));
  alert(`"${movie.title}" added to ${storageKey}!`);
}

watchLaterBtn.addEventListener("click", () => handleAdd("watchlater"));
favBtn.addEventListener("click", () => handleAdd("favorites"));

// ==== Similar content & scroll/drag same as before ====
async function fetchSimilar() {
  /* ... */
}
function updateSimilarContentRow(items) {
  /* ... */
}
window.addEventListener("scroll", () => {
  /* ... */
});
document.querySelectorAll(".content-row").forEach((row) => {
  /* ... */
});

// Kick off
fetchDetails();
fetchSimilar();
