<template>
  <div class="last-meals">
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
              <b-card-text>
                <li> {{ $t('energy_tot') }}: {{ meal.energy_tot }} </li>
                <li> {{ $t('carbohydrates_tot') }}: {{ meal.carbohydrates_tot }} </li>
                <li> {{ $t('sugars_tot') }}: {{ meal.sugars_tot }} </li>
                <li> {{ $t('fat_tot') }}: {{ meal.fat_tot }} </li>
                <li> {{ $t('saturated_fat_tot') }}: {{ meal.saturated_fat_tot }} </li>
                <li> {{ $t('proteins_tot') }}: {{ meal.proteins_tot }} </li>
                <li> {{ $t('fiber_tot') }}: {{ meal.fiber_tot }} </li>
                <li> {{ $t('salt_tot') }}: {{ meal.salt_tot }} </li>
                <li> {{ $t('sodium_tot') }}: {{ meal.sodium_tot }} </li>
                <li> {{ $t('alcohol_tot') }}: {{ meal.alcohol_tot }} </li>
                <li> {{ $t('calcium_tot') }}: {{ meal.calcium_tot }} </li>
                <li> {{ $t('carbon_footprint_tot') }}: {{ meal.carbon_footprint_tot }} </li>
                <li> {{ $t('water_footprint_tot') }}: {{ meal.water_footprint_tot }} </li>
                <div v-if = "meal.components!=null">
                  <div v-for="component in meal.components" v-bind:key="component.product_name">
                    <!-- <ul>
                      <li>
                        <img class="componentImage" :src="component.image_url" />
                        <div class="componentParagraph">
                          <p> {{ component.product_name }} </p>
                          <p> {{ $t('quantity') }}: {{ component.quantity }} g </p>
                        </div>
                      </li>
                    </ul> -->
                    <b-card
                      :img-src="component.image_url"
                      img-alt="Card image" img-left
                      class="mb-3"
                    >
                      <b-card-text align="center">
                        <p> {{ component.product_name }} </p>
                        <p> {{ $t('quantity') }}: {{ component.quantity }} g </p>
                      </b-card-text>
                    </b-card>
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
const config = require('../../../config.json');

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

      this.$http.get(`${config.server}api/${param.username}/meals`, { params: param })
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
  @import './last_meals.sass';
</style>
