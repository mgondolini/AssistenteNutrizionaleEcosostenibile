<template>
  <div class="last_meals">
    <h1>Your last Meals</h1>
    <span> {{ mealsList[0] }} </span>
    <h2>Meals</h2>
    <div role="tablist">
        <b-card
          no-body class="mb-1"
          v-for="(meal, index) in mealsList[0]"
          v-bind:key="index"
        >
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle="'accordion-' + index" variant="info">
              {{ meal.meal_name }}
            </b-button>
          </b-card-header>
          <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <li> Nome Pasto: {{ meal.meal_name }} </li>
                <li> Calorie totali: {{ meal.energy_tot }} </li>
                <li> Emissioni CO2: {{ meal.carbon_footprint_tot }} </li>
                <li> Acqua utilizzata: {{ meal.water_footprint_tot }} </li>
                <div v-if = "meal.components!=null">
                  <span> Components: </span>
                  <div v-for="component in meal.components" v-bind:key="component">
                    <li> {{ component.product_name }} g -
                         quantità: {{ component.quantity }} g</li>
                  </div>
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'last_meals',
  data() {
    return {
      mealsList: [],
    };
  },
  methods: {
    loadMealsList() {
      // TODO: prendere username da sessione
      const usr = 'mrossi';
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

<style lang="scss">
  @import './last_meals.scss';
</style>
