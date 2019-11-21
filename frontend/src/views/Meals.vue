<template>
    <div id="meal-app">
        <form>
            <div class="form-group">
                <label for="">Username</label>
                <input v-model="new_meal.username" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="meal_name">Meal name</label>
                <input v-model="new_meal.meals.meal_name" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="meal_num">comps</label>
                <label for="barcode">barcode</label>
                <input v-model="new_meal.meals.comps.barcode" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="quantity">quantity</label>
                <input v-model="new_meal.meals.comps.quantity" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="calories_tot">calories_tot</label>
                <input v-model="new_meal.meals.calories_tot" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label for="timestamp">timestamp</label>
                <input v-model="new_meal.meals.timestamp" type="text" class="form-control">
            </div>
        <button @click.prevent="addMeal" type="submit" class="btn btn-primary">Add Meal</button>
        <button @click.prevent="loadMeal" type="submit" class="btn btn-primary">Load</button>
        <button @click.prevent="updateUser" type="submit" class="btn btn-primary">Update</button>
        </form>
        <span> {{ mealList }} </span>
    </div>
</template>

<script>
export default {
  name: 'Meals',
  data() {
    return {
      meals: [],
      new_meal: {
        username: '',
        meals: {
          meal_name: '',
          comps:
            {
              barcode: '',
              quantity: 0,
            },
          calories_tot: 0,
          timestamp: '',
        },
      },
      mealList: '',
    };
  },
  methods: {
    loadMealsList() {
      const userInSession = { username: 'asd' };
      console.log(userInSession);
      this.$http.get('http://localhost:3000/api/meals/', userInSession)
        .then(response => {this.mealList = response.data})// entra in sessione
        .catch(error => (console.log(error)));
    },
    addMeal() {
      console.log(this.new_meal);
      this.$http.post('http://localhost:3000/api/meals/', this.new_meal)
        .then(response => this.meals.push(response.data))
        .catch(error => (console.log(error)));
    },
    loadMeal() {
      const mealName = 'asd';
      const userInSession = { username: 'asd' };
      this.$http.get(`http://localhost:3000/api/meals/${mealName}`, userInSession)
        .then(response => {this.mealList = response.data})
        .catch(error => (console.log(error)));
    },
    init() {
      this.loadMealsList();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
