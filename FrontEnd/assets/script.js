const API_URL = "http://localhost:5678/api";

// -- Fetch API --
async function fetchWorks() {
  const response = await fetch(`${API_URL}/works`);
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
}

// -- Galerie principale --
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

// -- Filtres --
function displayFilters(categories, allWorks) {
  const portfolio = document.querySelector("#portfolio");
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters");

  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("filter-btn", "active");
  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll, filtersContainer);
    displayWorks(allWorks);
  });
  filtersContainer.appendChild(btnAll);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.classList.add("filter-btn");
    btn.addEventListener("click", () => {
      setActiveButton(btn, filtersContainer);
      displayWorks(allWorks.filter((w) => w.categoryId === category.id));
    });
    filtersContainer.appendChild(btn);
  });

  const gallery = document.querySelector(".gallery");
  portfolio.insertBefore(filtersContainer, gallery);
}

function setActiveButton(activeBtn, container) {
  container.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// -- Mode édition (étape 5.3) --
function setupEditionMode() {
  const token = localStorage.getItem("token");
  if (!token) return;

  document.getElementById("edit-banner").classList.remove("hidden");

  const navLogin = document.getElementById("nav-login");
  navLogin.textContent = "logout";
  navLogin.href = "#";
  navLogin.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  });

  const filters = document.querySelector(".filters");
  if (filters) filters.classList.add("hidden");

  document.getElementById("btn-edit").classList.remove("hidden");
}

// -- Modale (étape 6) --
const modal = document.getElementById("modal");
const galleryView = document.getElementById("modal-gallery-view");
const formView = document.getElementById("modal-form-view");

function openModal() {
  modal.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  showGalleryView();
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

function showGalleryView() {
  galleryView.classList.remove("hidden");
  formView.classList.add("hidden");
}

function showFormView() {
  galleryView.classList.add("hidden");
  formView.classList.remove("hidden");
}

function displayModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete");
    btnDelete.innerHTML = "🗑️";
    btnDelete.dataset.id = work.id;
    btnDelete.addEventListener("click", () => deleteWork(work.id, figure, works));
    figure.appendChild(img);
    figure.appendChild(btnDelete);
    modalGallery.appendChild(figure);
  });
}

function setupModal(allWorks, categories) {
  document.getElementById("btn-edit").addEventListener("click", () => {
    displayModalGallery(allWorks);
    openModal();
  });

  document.querySelectorAll(".modal-close").forEach((btn) =>
    btn.addEventListener("click", closeModal)
  );
  document.querySelector(".modal-overlay").addEventListener("click", closeModal);

  document.getElementById("btn-add-photo").addEventListener("click", showFormView);
  document.querySelector(".modal-back").addEventListener("click", showGalleryView);

  const select = document.getElementById("work-category");
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });

  document.getElementById("work-image").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = document.getElementById("photo-preview");
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
    document.querySelector(".upload-placeholder").classList.add("hidden");
  });
}

// -- Suppression (étape 7) --
async function deleteWork(id, figureElement, allWorks) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 204) {
    figureElement.remove();
    const index = allWorks.findIndex((w) => w.id === id);
    if (index !== -1) allWorks.splice(index, 1);
    displayWorks(allWorks);
  }
}

// -- Ajout d'un travail (étapes 8.1 & 8.2) --
function setupAddWorkForm(allWorks) {
  const form = document.getElementById("add-work-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const imageFile = document.getElementById("work-image").files[0];
    const title = document.getElementById("work-title").value;
    const categoryId = document.getElementById("work-category").value;

    if (!imageFile || !title || !categoryId) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", categoryId);

    const response = await fetch(`${API_URL}/works`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      allWorks.push(newWork);
      displayWorks(allWorks);
      displayModalGallery(allWorks);
      form.reset();
      document.getElementById("photo-preview").classList.add("hidden");
      document.querySelector(".upload-placeholder").classList.remove("hidden");
      showGalleryView();
    }
  });
}

// -- Init --
async function init() {
  const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
  displayWorks(works);
  displayFilters(categories, works);
  setupEditionMode();
  setupModal(works, categories);
  setupAddWorkForm(works);
}

init();
