<template>
  <div class="last_meals">
    <h1>Your last Meals</h1>
    <span> {{ userMeals }} </span>
    <h2>Meals</h2>
    <div v-if = "userMeals[0].meals!=null">
      <div v-for="meal in userMeals[0].meals" v-bind:key="meal.meal_name">
        <li> {{ meal.meal_name }} </li>
        <li> {{ meal.calories_tot }} </li>
        <li> {{ meal.timestamp }} </li>
        <div v-if = "meal.components!=null">
          <div v-for="component in meal.components" v-bind:key="component.barcode">
            <li> {{ component.barcode }} </li>
            <li> {{ component.quantity }} </li>
          </div>
        </div>
      </div>
    </div>
    <!-- <li v-for="component in mealsList[0].meals.components" v-bind:key="component">
      {{ component.barcode }}
      {{ component.quantity }}
    </li> -->
  </div>
</template>

<script>
export default {
  name: 'last_meals',
  data() {
    return {
      meals: {
        meal_name: '',
        components:
        {
          barcode: '',
          quantity: 0,
        },
        calories_tot: 0,
        timestamp: '',
      },
      userMeals: [],
      mealsList: [],
    };
  },
  methods: {
    loadMealsList() {
    // TODO: prendere username da sessione
      const usr = 'kiur';
      const param = { username: usr };

      this.$http.get(`http://localhost:8081/api/${param.username}/meals`, { params: param })
        .then((response) => {
          this.userMeals.push(response.data);
          this.mealsList.push(response.data.meals);
        })
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

<style scoped>

</style>
