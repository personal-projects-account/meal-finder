const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random-search'),
    display_meals = document.getElementById('display-meals'),
    resultHeading = document.getElementById('display-result-heading'),
    display_single_meal = document.getElementById('display-single-meal');

// Search for meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    display_single_meal.innerHTML = '';

    // Get search term
    const term = search.value;

    // fetch meals from API
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {                
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                // Check if no meals found
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no search results. Try again!</h2>`;
                } else {
                    display_meals.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join('');
                }
            });        
            // Clear search text
            search.value = '';        
    } else {
        alert('Please enter a search term');
    }
}

// Fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];            
            addMealToDOM(meal);
        });
}

// Fetch random meal from API
function getRandomMeal() {
    // Clear meals and heading
    display_meals.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];            
            addMealToDOM(meal);
        });
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    // Iterate through meal ingredients and measures arrays
    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    display_single_meal.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

display_meals.addEventListener('click', e => {    
    const mealInfo = e.path.find(item => {        
        if (item.classList) {            
            return item.classList.contains('meal-info');
        } else {
            return false;
        }        
    });
    
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});