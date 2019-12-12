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
              <b-container class="pb-5">
                <b-card-text class="nutri-title m-0">{{ $t('nutrition_facts') }}</b-card-text>
                <b-row class="p-2 b-thick">
                  <b-col class="col-3"></b-col>
                  <b-col class="col-3"></b-col>
                  <b-col class="col-5 small"> {{ $t('daily_value') }}</b-col>
                </b-row>
                <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('energy_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.energy_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                <b-row class="border-bottom p-2">
                  <b-col class="col-3">  {{ $t('carbohydrates_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.carbohydrates_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('sugars_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.sugars_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('fat_tot') }}</b-col>
                  <b-col class="col-3"> {{ meal.fat_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('saturated_fat_tot') }}</b-col>
                  <b-col class="col-3"> {{ meal.saturated_fat_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('proteins_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.proteins_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('fiber_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.fiber_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('salt_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.salt_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('sodium_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.sodium_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('alcohol_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.alcohol_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
                  <b-row class="b-thick p-2">
                  <b-col class="col-3"> {{ $t('calcium_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.calcium_tot }} </b-col>
                </b-row>
                 <b-row class="border-bottom p-2">
                  <b-col class="col-3"> {{ $t('carbon_footprint_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.carbon_footprint_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
               </b-row>
                 <b-row class="b-thick p-2 mb-5">
                  <b-col class="col-3"> {{ $t('water_footprint_tot') }} </b-col>
                  <b-col class="col-3"> {{ meal.water_footprint_tot }} </b-col>
                  <b-col class="col-5"> fabbisogno giornaliero </b-col>
                </b-row>
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
              </b-container>
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
  @import './last_meals.sass'
</style>
