const input = document.querySelector(".search");
const searchBtn = document.querySelector(".btn");
const result = document.querySelector(".result .container .meals");
const randomMeal = document.querySelector(".randomMeal .meal");

const getMeals = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      resolve(data.meals);
    };
    xhr.send();
  });
  return promise;
};

const render = (meal) => {
  const name = meal.strMeal;
  const area = meal.strArea;
  const category = meal.strCategory;
  const image = meal.strMealThumb;
  const id = meal.idMeal;

  result.innerHTML += `
  <a id="${id}">
  <div>
    <img src="${image}" alt="img" />
    <div class="description">
      <h1>${name}</h1>
      <p>Hi! I belong to ${category} category and i am ${area}</p>
    </div>
  </div>
</a>
  `;
};

const search = (e) => {
  e.preventDefault();
  document.querySelector(".result").classList.add("block");
  result.innerHTML = "";
  result.closest(".result").getElementsByClassName.display = "block";
  getMeals(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + input.value
  )
    .then((data) => {
      result.parentElement.scrollIntoView({
        behavior: "smooth",
      });
      data.forEach((meal) => {
        render(meal);
      });
      result.querySelectorAll("a").forEach((e) => {
        e.addEventListener(
          "click",
          getMealByID.bind(
            null,
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e.id}`
          )
        );
      });
    })
    .catch(() => {
      result.innerHTML = "Not found";
    });
};

const getMealByID = (url, id = "") => {
  if (id != "") {
    randomMeal.parentElement.scrollIntoView({
      behavior: "smooth",
    });
  }
  getMeals(url).then((meal) => {
    const name = meal[0].strMeal;
    const image = meal[0].strMealThumb;
    const video = meal[0].strYoutube.replace(".com/watch?v=", ".com/embed/");
    const instructions = meal[0].strInstructions;
    let ing = {};
    for (const el in meal[0]) {
      if (el.includes("strIngredient")) {
        ing[meal[0][el]] = meal[0][el.replace("Ingredient", "Measure")];
      }
    }
    let str = "";
    for (const el in ing) {
      if (el) {
        str += `
          <li>
             <span>${el}</span>
             <span>${ing[el]}</span>
          </li>`;
      }
    }
    randomMeal.innerHTML = `
      <div class="info">
      <h2>${name}</h2>
      <img src=${image} alt="src"/>
      <ul>
      ${str}
        
      </ul>
    </div>
    <div class="howTo">
    <h1>How to Cook this? 😋</h1>
     <iframe
     title="video"
        src=${video}
         frameborder="0"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowfullscreen
      ></iframe>
      <p class="instructions">
      <b>Instructions :</b><br>
      ${instructions}
      </p>
      </div>
        `;
  });
};

searchBtn.addEventListener("click", search);
getMealByID("https://www.themealdb.com/api/json/v1/1/random.php");
