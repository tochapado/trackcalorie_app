function $(value) {
    return document.querySelector(value);
}

class CalorieTracker {
    constructor() {
        this._caloriesLimit = Storage.getCaloriesLimit(420);
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        $('#limit').placeholder = this._caloriesLimit;

        this._render();
    };

    // Public Methods
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal);
        this._render();

        Storage.updateTotalCalories(this._totalCalories);
        Storage.updateMeals(this._meals);
    };

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._render();

        Storage.updateTotalCalories(this._totalCalories);
        Storage.updateWorkouts(this._workouts);
    };

    removeMeal(id) {
        const array = [];
        for(let i = 0; i < this._meals.length; i++) {
            if(this._meals[i].id === id) {
                this._totalCalories -= this._meals[i].calories;
                continue;
            };
            array.push(this._meals[i]);
        };
        this._meals = array;

        Storage.updateTotalCalories(this._totalCalories);
        Storage.updateMeals(this._meals);
        this._render();
    };

    removeWorkout(id) {
        const array = [];
        for(let i = 0; i < this._workouts.length; i++) {
            if(this._workouts[i].id === id) {
                this._totalCalories += this._workouts[i].calories;
                continue;
            };
            array.push(this._workouts[i]);
        };
        this._workouts = array;

        Storage.updateTotalCalories(this._totalCalories);
        Storage.updateWorkouts(this._workouts);
        this._render();
    };

    reset() {
        this._meals = [];
        this._workouts = [];
        this._totalCalories = 0;
        this._render();

        Storage.updateTotalCalories(this._totalCalories);
        Storage.updateMeals(this._meals);
        Storage.updateWorkouts(this._workouts);
    };

    setLimit(limit) {
        this._caloriesLimit = limit;
        this._render();

        Storage.setCaloriesLimit(limit);
    };

    loadItems() {
      for(let i = 0; i < this._meals.length; i++) {
        this._displayNewMeal(this._meals[i]);
      };
      for(let i = 0; i < this._workouts.length; i++) {
        this._displayNewWorkout(this._workouts[i]);
      };
    };

    // Private Methods
    _displayTotalCalories() {
        const totalCaloriesElement = $('#calories-total');
        totalCaloriesElement.textContent = this._totalCalories;
    };

    _displayCaloriesLimit() {
        const caloriesLimitElement = $('#calories-limit');
        caloriesLimitElement.textContent = this._caloriesLimit;
    };

    _displayCaloriesConsumed() {
        const caloriesConsumedElement = $('#calories-consumed');
        let caloriesConsumed = 0;
        for(let i = 0; i < this._meals.length; i++) {
            caloriesConsumed += this._meals[i].calories;
        };
        caloriesConsumedElement.textContent = caloriesConsumed;
    };

    _displayCaloriesBurned() {
        const caloriesBurnedElement = $('#calories-burned');
        let caloriesBurned = 0;
        for(let i = 0; i < this._workouts.length; i++) {
            caloriesBurned += this._workouts[i].calories;
        };
        caloriesBurnedElement.textContent = caloriesBurned;
    };

    _displayCaloriesRemaining() {
        const caloriesRemainingElement = $('#calories-remaining');
        const caloriesRemaining = this._caloriesLimit -  this._totalCalories;
        caloriesRemainingElement.textContent = caloriesRemaining;

        if(caloriesRemaining <=0) {
            caloriesRemainingElement.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingElement.parentElement.parentElement.classList.add('bg-danger');
        } else {
            caloriesRemainingElement.parentElement.parentElement.classList.add('bg-light');
            caloriesRemainingElement.parentElement.parentElement.classList.remove('bg-danger');
        };
    };

    _displayCaloriesProgress() {
        const caloriesProgressElement = $('#calorie-progress');
        const caloriesProgress = Math.min(this._totalCalories / this._caloriesLimit * 100, 100);

        caloriesProgressElement.style.width = `${caloriesProgress}%`;

        if(caloriesProgress === 100) {
            caloriesProgressElement.classList.add('bg-danger');
        } else {
            caloriesProgressElement.classList.remove('bg-danger');
        };
    }

    _displayNewMeal(meal) {
        const mealsEl = $('#meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                >
                    ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                </div>
            </div>
        `;
        mealsEl.appendChild(mealEl);
    };

    _displayNewWorkout(workout) {
        const workoutsEl = $('#workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div
                    class="fs-1 lg bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                >
                    ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                </div>
            </div>
        `;
        workoutsEl.appendChild(workoutEl);
    };

    _render() {
        this._displayCaloriesLimit();
        this._displayTotalCalories();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    };
};

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    };
};

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    };
};

class Storage {
  static getCaloriesLimit(defaultLimit = 2000) {
    let caloriesLimit = defaultLimit;
    if(localStorage.getItem('caloriesLimit') !== null) {
      caloriesLimit = +localStorage.getItem('caloriesLimit');
    };
    return caloriesLimit;
  };

  static setCaloriesLimit(caloriesLimit) {
    localStorage.setItem('caloriesLimit', caloriesLimit);
  };

  static getTotalCalories(defaultCalories = 0) {
    if(localStorage.getItem('totalCalories') !== null) {
      return +localStorage.getItem('totalCalories');
    };
    return defaultCalories;
  };

  static updateTotalCalories(totalCalories) {
    localStorage.setItem('totalCalories', totalCalories);
  };

  static getMeals() {
    if(localStorage.getItem('meals') !== null) {
      return JSON.parse(localStorage.getItem('meals'));
    };
    return [];
  };

  static updateMeals(meals) {
    localStorage.setItem('meals', JSON.stringify(meals));
  };

  static getWorkouts() {
    if(localStorage.getItem('workouts') !== null) {
      return JSON.parse(localStorage.getItem('workouts'));
    };
    return [];
  };

  static updateWorkouts(workouts) {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  };
};

class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();
        this._loadEventListeners();
    };

    _loadEventListeners() {
      $('#meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

      $('#workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

      $('#meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

      $('#workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

      $('#filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

      $('#filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

      $('#reset').addEventListener('click', this._reset.bind(this));

      $('#limit-form').addEventListener('submit', this._setLimit.bind(this));
    };

    _newItem(type, e) {
        e.preventDefault();
        const name = $(`#${type}-name`);
        const calories = $(`#${type}-calories`);

        if(name.value === '' || calories.value === '') {
            alert('Please fill in all fields!.');
            return;
        };

        if(type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else if(type === 'workout') {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        };

        name.value = '';
        calories.value = '';

        const collapseItem = $(`#collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    };

    _removeItem(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if(confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                if(type === 'meal') {
                    this._tracker.removeMeal(id);
                } else if(type === 'workout') {
                    this._tracker.removeWorkout(id);
                };
                e.target.closest('.card').remove();
            };
        };
    };

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        const items = document.querySelectorAll(`#${type}-items h4`);
        for(let i = 0; i < items.length; i++) {
            const name = items[i].textContent;
            if(name.toLowerCase().indexOf(text) !== -1) {
                items[i]
                    .parentElement
                    .parentElement
                    .parentElement
                    .style
                    .display = 'block';
            } else if(name.toLowerCase().indexOf(text) === -1) {
                items[i]
                    .parentElement
                    .parentElement
                    .parentElement
                    .style
                    .display = 'none';
            };
        };
    };

    _reset() {
        this._tracker.reset();
        $('#meal-items').innerHTML = '';
        $('#workout-items').innerHTML = '';
        $('#filter-meals').value = '';
        $('#filter-workouts').value = '';
    };

    _setLimit(e) {
        e.preventDefault();

        const limit = $('#limit');

        if(limit.value === '') {
            alert('Please add a limit');
            return;
        };

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = $('#limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    };
};

const app = new App();
