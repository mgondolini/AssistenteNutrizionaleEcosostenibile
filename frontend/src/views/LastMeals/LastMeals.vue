<template>
  <div class="last_meals">
    <h1>Your last Meals</h1>
    <span> {{ userMeals }} </span>
    <h2> Meals</h2>
    <span> {{ mealsList }} </span>
    <ul id="example-1">
      <li v-for="meal in mealsList[0]" v-bind:key="meal">
        {{ meal.meal_name }}
        {{ meal.components }}
        {{ meal.calories_tot }}
      </li>
    </ul>
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
