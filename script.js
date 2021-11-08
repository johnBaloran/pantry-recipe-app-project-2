const apiKey = "914e2817b56c4dc48483a6c50bb886ac";
const searchForm = document.querySelector("form");
const listOfRecipes = document.querySelector(".search-results");

// fill out 3-5 ingredient inputs
const ingredient1 = document.querySelector(".ingredient1");
const ingredient2 = document.querySelector(".ingredient2");
const ingredient3 = document.querySelector(".ingredient3");
const ingredient4 = document.querySelector(".ingredient4");
const ingredient5 = document.querySelector(".ingredient5");

// Get food value out of form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  findRecipes(
    ingredient1.value,
    ingredient2.value,
    ingredient3.value,
    ingredient4.value,
    ingredient5.value
  );
});
// use value to fetch api
const findRecipes = async (a, b, c, d, e) => {
  const baseURL = ` https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${a},+${b},+${c},+${d},+${e}&number=1000`;
  const response = await fetch(baseURL);
  const data = await response.json();

  const results = data.filter((n) => {
    return n.missedIngredientCount <= 2;
  });
  console.log(results);

  availablerecipes(results);
};
//render results in the dom
const availablerecipes = (results) => {
  results.forEach((result) => {
    const recipe = document.createElement("div");
    // add a link to recipe website in each recipe with an image
    recipeWebsiteLink(result, recipe);
    listOfRecipes.appendChild(recipe);
  });
};

const recipeWebsiteLink = async (result, dish) => {
  const baseURL = `https://api.spoonacular.com/recipes/${result.id}/information?apiKey=${apiKey}`;
  const response = await fetch(baseURL);
  const data = await response.json();
  console.log(data);
  dish.innerHTML = `<div>
  <a href=${data.sourceUrl} target="_blank"> <img src="${result.image}" alt="${result.title}"></a>
</div>`;
};
