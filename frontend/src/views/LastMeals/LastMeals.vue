<template>
  <div class="last_meals">
    <h1>Your last Meals</h1>
    <span> {{ mealsList[0] }} </span>
    <h2>Meals</h2>
    <div role="tablist">
      <div v-for="(meal, index) in mealsList[0]" v-bind:key="index">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle="'accordion-' + index" variant="info">
              {{ meal.meal_name }}
            </b-button>
          </b-card-header>
          <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <li> Nome Pasto: {{ meal.meal_name }} </li>
                <li> Calorie totali: {{ meal.calories_tot }} </li>
                <li> Timestamp: {{ meal.timestamp }} </li>
                <div v-if = "meal.components!=null">
                  <div v-for="component in meal.components" v-bind:key="component.barcode">
                    <span> Components: </span>
                    <li> Barcode: {{ component.barcode }} </li>
                    <li> Quantità: {{ component.quantity }} </li>
                  </div>
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
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
