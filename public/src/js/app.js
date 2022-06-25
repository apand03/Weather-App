import { fetchData, initialData } from "./Helper/Fetch.js";

// Form Element
const form = document.querySelector(".header__form");

form.addEventListener("submit", fetchData);

initialData();
