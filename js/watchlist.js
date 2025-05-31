// watchlist.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Section toggle (Movies vs TV) ---
  const mvBtn = document.getElementById("mv-btn");
  const tvBtn = document.getElementById("tv-btn");
  const moviesSection = document.getElementById("movies-section");
  const tvSection = document.getElementById("tv-series-section");

  function setActive(section) {
    if (section === "movies") {
      moviesSection.classList.remove("hidden");
      tvSection.classList.add("hidden");
      mvBtn.classList.add("active");
      tvBtn.classList.remove("active");
    } else {
      moviesSection.classList.add("hidden");
      tvSection.classList.remove("hidden");
      mvBtn.classList.remove("active");
      tvBtn.classList.add("active");
    }
  }
  mvBtn.addEventListener("click", () => setActive("movies"));
  tvBtn.addEventListener("click", () => setActive("tv"));
  setActive("movies");
  const toggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    navMenu.classList.toggle("show");
  });
  // --- Modal elements for editing category ---
  const modal = document.querySelector(".edit-modal");
  const categorySel = document.getElementById("category-select");
  const saveBtn = document.getElementById("save-category");
  const cancelBtn = document.getElementById("cancel-edit");
  let currentItem, currentKey;

  // Helper: storageKey → containerId (e.g. "moviesFavourites" → "movies-favourites")
  const toContainerId = (key) => key.replace(/([A-Z])/g, "-$1").toLowerCase();

  // Populate one list container
  function populateContainer(containerId, storageKey) {
    const container = document.getElementById(containerId);
    const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = `<p>No entries in ${storageKey} yet.</p>`;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = item.id;

      card.innerHTML = `
        <img src="${item.posterPath}" alt="${item.title}" />
        <div class="card-title">${item.title}</div>
      `;

      // controls
      const controls = document.createElement("div");
      controls.classList.add("controls");

      // Edit
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.innerHTML = `Edit <i class="fa-solid fa-pen"></i>`;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentItem = item;
        currentKey = storageKey;
        // pre-select modal dropdown
        const suffix = storageKey.replace(/^[a-z]+/, ""); // e.g. "Favourites", "Watchlater", "Watched"
        categorySel.value = suffix.toLowerCase();
        modal.classList.remove("hidden");
      });

      // Delete
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteItem(item.id, storageKey);
      });

      controls.append(editBtn, deleteBtn);
      card.appendChild(controls);

      // click card → details page
      card.addEventListener("click", () => {
        const type = storageKey.startsWith("tv") ? "tv" : "movie";
        window.location.href = `details.html?type=${type}&id=${item.id}`;
      });

      container.appendChild(card);
    });
  }

  // Delete & refresh
  function deleteItem(id, storageKey) {
    let list = JSON.parse(localStorage.getItem(storageKey) || "[]");
    list = list.filter((i) => i.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(list));
    populateContainer(toContainerId(storageKey), storageKey);
  }

  // Save (move between lists)
  saveBtn.addEventListener("click", () => {
    const newCategory = categorySel.value; // "favourites", "watchlater", or "watched"
    const prefix = currentKey.startsWith("movies") ? "movies" : "tv";
    const capitalized =
      newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
    const newKey = prefix + capitalized;

    // remove from old
    let oldList = JSON.parse(localStorage.getItem(currentKey) || "[]");
    oldList = oldList.filter((i) => i.id !== currentItem.id);
    localStorage.setItem(currentKey, JSON.stringify(oldList));

    // add to new
    const newList = JSON.parse(localStorage.getItem(newKey) || "[]");
    newList.push(currentItem);
    localStorage.setItem(newKey, JSON.stringify(newList));

    // refresh both
    populateContainer(toContainerId(currentKey), currentKey);
    populateContainer(toContainerId(newKey), newKey);

    modal.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // --- Initial render: now including the new "Watched" lists ---
  [
    ["movies-favourites", "moviesFavourites"],
    ["movies-watchlater", "moviesWatchlater"],
    ["movies-watched", "moviesWatched"],
    ["tv-favourites", "tvFavourites"],
    ["tv-watchlater", "tvWatchlater"],
    ["tv-watched", "tvWatched"],
  ].forEach(([containerId, storageKey]) => {
    populateContainer(containerId, storageKey);
  });
});
