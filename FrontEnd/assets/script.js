// =====================
// Récupération des travaux depuis l'API
// =====================

const API_URL = "http://localhost:5678/api";

async function fetchWorks() {
  const response = await fetch(`${API_URL}/works`);
  const works = await response.json();
  return works;
}

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
// Initialisation
// =====================

async function init() {
  const works = await fetchWorks();
  displayWorks(works);
}

init();
