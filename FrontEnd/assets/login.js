const API_URL = "http://localhost:5678/api";

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  errorMsg.textContent = "";

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      errorMsg.textContent = "Identifiants incorrects. Veuillez réessayer.";
      return;
    }

    const data = await response.json();

    // Stockage du token pour les actions admin
    localStorage.setItem("token", data.token);

    // Redirection vers la page d'accueil
    window.location.href = "index.html";
  } catch (error) {
    errorMsg.textContent = "Une erreur est survenue. Veuillez réessayer.";
  }
});
