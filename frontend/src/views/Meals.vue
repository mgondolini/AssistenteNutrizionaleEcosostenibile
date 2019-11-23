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
        <button @click.prevent="newMeal" type="submit" class="btn btn-primary">New Meal</button>
        <button @click.prevent="loadMeal" type="submit" class="btn btn-primary">Load</button>
        <button @click.prevent="addMeal" type="submit" class="btn btn-primary">Add Meal</button>
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
      // body creato da me per fare una prova (nel mio db locale )
      const body = { username: 'asd' };
      console.log(body);

      this.$http.get('http://localhost:3000/api/meals/', body)
        .then((response) => {
          this.mealList = response.data;
        })
        .catch(error => (console.log(error)));
    },
    newMeal() {
      console.log(this.new_meal);
      this.$http.post('http://localhost:3000/api/meals/', this.new_meal)
        .then(response => this.meals.push(response.data))
        .catch(error => (console.log(error)));
    },
    loadMeal() {
      const mealName = 'asd';
      const user = { username: 'asd' };
      this.$http.get(`http://localhost:3000/api/meals/${mealName}`, user)
        .then((response) => { this.mealList = response.data; })
        .catch(error => (console.log(error)));
    },
    addMeal() {
      // aggiunge un pasto al set
    },
    updateMeal() {
      // update di tutto il pasto (calorie, ecc), da chiamre dentro updateMealComponents
    },
    addMealComponent() {
      // aggiunge prodotti all'array
    },
    init() {
      this.loadMealsList();
    },
  },
  mounted() {
    this.loadMealsList();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
