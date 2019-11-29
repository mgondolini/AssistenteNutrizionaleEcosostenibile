<template>
  <div class="last_meals">
    <h1>Your last Meals</h1>
    <span> {{ userMeals }} </span>
    <h2>Meals</h2>
    <div role="tablist">
      <div v-for="meal in userMeals[0].meals" v-bind:key="meal.meal_name">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-1 variant="info">
              {{ meal.meal_name }}
            </b-button>
          </b-card-header>
          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <li> Nome Pasto: {{ meal.meal_name }} </li>
                <li> Calorie totali: {{ meal.calories_tot }} </li>
                <li> Timestamp: {{ meal.timestamp }} </li>
                <div v-if = "meal.components!=null">
                  <div v-for="component in meal.components" v-bind:key="component.barcode">
                    <h> Components: </h>
                    <li> Barcode: {{ component.barcode }} </li>
                    <li> Quantità: {{ component.quantity }} </li>
                  </div>
                </div>
              </b-card-text>
              <b-card-text>{{ text }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-2 variant="info">Accordion 2</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>{{ text }}</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-3 variant="info">Accordion 3</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>{{ text }}</b-card-text>
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
