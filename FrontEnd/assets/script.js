// =====================
// Récupération des données depuis l'API
// =====================

const API_URL = "http://localhost:5678/api";

async function fetchWorks() {
  const response = await fetch(`${API_URL}/works`);
  const works = await response.json();
  return works;
}

async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  const categories = await response.json();
  return categories;
}

// =====================
// Affichage de la galerie
// =====================

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// =====================
// Filtres par catégorie (Étapes 3 & 4)
// =====================

function displayFilters(categories, allWorks) {
  const portfolio = document.querySelector("#portfolio");

  // Conteneur des filtres (inséré avant la galerie)
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters");

  // Bouton "Tous"
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("filter-btn", "active");
  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll, filtersContainer);
    displayWorks(allWorks);
  });
  filtersContainer.appendChild(btnAll);

  // Boutons par catégorie
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.classList.add("filter-btn");
    btn.addEventListener("click", () => {
      setActiveButton(btn, filtersContainer);
      const filtered = allWorks.filter((work) => work.categoryId === category.id);
      displayWorks(filtered);
    });
    filtersContainer.appendChild(btn);
  });

  // Insertion avant la galerie
  const gallery = document.querySelector(".gallery");
  portfolio.insertBefore(filtersContainer, gallery);
}

function setActiveButton(activeBtn, container) {
  container.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// =====================
// Initialisation
// =====================

async function init() {
  const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
  displayWorks(works);
  displayFilters(categories, works);
}

init();
