const apiKey = "914e2817b56c4dc48483a6c50bb886ac";
const searchForm = document.querySelector("form");
const listOfRecipes = document.querySelector(".search-results");
const modalContainer = document.getElementById("modal_container");

// fill out 3-5 ingredient inputs
const ingredient1 = document.querySelector(".ingredient1");
const ingredient2 = document.querySelector(".ingredient2");
const ingredient3 = document.querySelector(".ingredient3");
const ingredient4 = document.querySelector(".ingredient4");
const ingredient5 = document.querySelector(".ingredient5");

// Get food value out of form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // use ingredients input.value to fetch api
  findRecipes(
    ingredient1.value,
    ingredient2.value,
    ingredient3.value,
    ingredient4.value,
    ingredient5.value
  );
});

// function that gates recipes from an api based on inputted ingredients
const findRecipes = async (a, b, c, d, e) => {
  const baseURL = ` https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${a},+${b},+${c},+${d},+${e}&number=10000&ignorePantry=true&ranking=1`;
  const response = await fetch(baseURL);
  const data = await response.json();

  // data received from api is filtered to only have 2 or less missing ingredients
  const results = data.filter((n) => {
    return n.missedIngredientCount <= 2;
  });
  console.log(results);

  // filtered data plugged in a function that renders a collection of divs that has information on each recipe
  availablerecipes(results);
};
// a function that uses data from the api to make a div that has information on available recipes
const availablerecipes = (results) => {
  listOfRecipes.innerHTML = "";
  results.forEach((result) => {
    const recipe = document.createElement("div");
    recipe.innerHTML = `<div>
  <h2>${result.title}</h2>
  <div>
    <img src="${result.image}" alt="${result.title}" />
  </div>
</div>`;
    missingUsedOrUnusedIngredients(
      result.usedIngredients,
      recipe,
      "Used Ingredient(s):"
    );
    missingUsedOrUnusedIngredients(
      result.unusedIngredients,
      recipe,
      "Unused Ingredient(s):"
    );
    missingUsedOrUnusedIngredients(
      result.missedIngredients,
      recipe,
      "Missing Ingredient(s):"
    );

    const buttonlinkWebsite = document.createElement("button");
    buttonlinkWebsite.textContent = "Click to generate recipe website";
    buttonlinkWebsite.addEventListener("click", () => {
      recipeWebsiteLink(result.id);
      modalContainer.classList.add("show");
    });
    recipe.append(buttonlinkWebsite);
    listOfRecipes.appendChild(recipe);
  });
};

function missingUsedOrUnusedIngredients(data, div, listTitle) {
  const ingredients = data.map((ingredient) => {
    return ingredient.name;
  });
  const title = document.createElement("h4");
  title.textContent = listTitle;
  div.appendChild(title);
  ingredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.textContent = ingredient;
    div.appendChild(listItem);
  });
}

const recipeWebsiteLink = async (result) => {
  const baseURL = `https://api.spoonacular.com/recipes/${result}/information?apiKey=${apiKey}&includeNutrition=true`;
  const response = await fetch(baseURL);
  const data = await response.json();
  console.log(data);
  displayModalRecipeInformation(data);
};

const displayModalRecipeInformation = (recipeInfo) => {
  modalContainer.classList.add("show");
  const modalInfo = document.getElementById("modal");
  modalInfo.innerHTML = "";

  const closeModalButton = document.createElement("button");
  closeModalButton.innerHTML = `<i class="fas fa-times fa-3x"></i>`;
  closeModalButton.classList.add("closeButton");
  closeModalButton.addEventListener("click", closeModal);

  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = recipeInfo.title;

  const recipeOtherInfos = document.createElement("div");
  recipeOtherInfos.classList.add("recipeInfos");
  recipeOtherInfos.innerHTML = `
  <p>Ready in <span>${recipeInfo.readyInMinutes}</span> minutes</p>
  <p><span>${recipeInfo.servings}</span> servings</p>
 <a href="${recipeInfo.sourceUrl}" target="_blank">Recipe Website</a>`;

  const instructions = recipeInfo.analyzedInstructions[0].steps;
  const recipeSteps = document.createElement("ol");
  console.log(instructions);

  instructions.forEach((step) => {
    const recipeStep = document.createElement("li");
    recipeStep.textContent = step.step;
    recipeSteps.appendChild(recipeStep);
  });
  modalInfo.appendChild(closeModalButton);
  modalInfo.appendChild(recipeTitle);
  modalInfo.appendChild(recipeSteps);
  modalInfo.appendChild(recipeOtherInfos);
};

function closeModal() {
  modalContainer.classList.remove("show");
}
