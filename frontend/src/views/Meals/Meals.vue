<template>
  <div class="meals">
    <h1> {{ $t('last_meals') }} </h1>
    <div class="card-last-meals" role="tablist">
        <b-card
          no-body class="mb-1"
          v-for="(meal, index) in mealsList[0]"
          v-bind:key="index"
        >
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button block href="#" v-b-toggle="'accordion-' + index" variant="info">
              {{ meal.meal_name }}
            </b-button>
          </b-card-header>
          <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <div v-if = "meal.components!=null">
                <div v-for="component in meal.components" v-bind:key="component.product_name">
                  <b-card
                    :img-src="component.image_url"
                    img-alt="Card image" img-left
                    class="mb-3"
                  >
                    <b-card-text align="center" class="m-0">
                      <p class="component-p">
                        <b> {{ component.product_name }} </b>
                      </p>
                      <p class="component-p">
                        {{ component.quantity }} g
                      </p>
                    </b-card-text>
                  </b-card>
                </div>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'meals',
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

      this.$http.get(`api/${param.username}/meals`, { params: param })
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


<i18n>
{
  "en": {
    "nutrition_facts": "Nutrition Facts",
    "daily_value": "% Daily Value",
    "last_meals": "Your last meals",
    "energy_tot": "Energy",
    "carbohydrates_tot": "Carbohydrates",
    "sugars_tot": "Sugars",
    "fat_tot": "Fats",
    "saturated_fat_tot": "Saturated fats",
    "proteins_tot": "Proteins",
    "fiber_tot": "Fibers",
    "salt_tot": "Salt",
    "sodium_tot": "Sodium",
    "alcohol_tot": "Alcohol",
    "calcium_tot": "Calcium",
    "carbon_footprint_tot": "Carbon footprint",
    "water_footprint_tot": "Water footprint",
    "quantity": "Quantity"
  },
  "it": {
    "nutrition_facts": "Valori nutrizionali",
    "daily_value": "% Valore giornaliero",
    "last_meals": "I tuoi ultimi pasti",
    "energy_tot": "Calorie",
    "carbohydrates_tot": "Carboidrati",
    "sugars_tot": "Zuccheri",
    "fat_tot": "Grassi",
    "saturated_fat_tot": "Grassi saturi",
    "proteins_tot": "Proteine",
    "fiber_tot": "Fibre",
    "salt_tot": "Sale",
    "sodium_tot": "Sodio",
    "alcohol_tot": "Alcool",
    "calcium_tot": "Calcio",
    "carbon_footprint_tot": "Impronta ambientale CO2",
    "water_footprint_tot": "Consumo d'Acqua",
    "quantity": "Quantità"
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
