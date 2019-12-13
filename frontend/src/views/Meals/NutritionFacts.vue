<template>
    <div class="nutrition-facts">
        <b-card>
            <b-container class="pb-5">
                <b-card-text class="nutri-title m-0">{{ $t('nutrition_facts') }}</b-card-text>
                <b-row class="p-2 b-thick">
                    <b-col class="col-3"></b-col>
                    <b-col class="col-3"></b-col>
                    <b-col class="col-5 small"> {{ $t('daily_value') }}</b-col>
                </b-row>
                <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('energy_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.energy_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                <b-row class="border-bottom p-1">
                    <b-col class="col-3">  {{ $t('carbohydrates_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.carbohydrates_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('sugars_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.sugars_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('fat_tot') }}</b-col>
                    <b-col class="col-3"> {{ meal.fat_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('saturated_fat_tot') }}</b-col>
                    <b-col class="col-3"> {{ meal.saturated_fat_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('proteins_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.proteins_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('fiber_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.fiber_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('salt_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.salt_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('sodium_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.sodium_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('alcohol_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.alcohol_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="b-thick p-1">
                    <b-col class="col-3"> {{ $t('calcium_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.calcium_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="border-bottom p-1">
                    <b-col class="col-3"> {{ $t('carbon_footprint_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.carbon_footprint_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
                    <b-row class="b-thick p-1 mb-5">
                    <b-col class="col-3"> {{ $t('water_footprint_tot') }} </b-col>
                    <b-col class="col-3"> {{ meal.water_footprint_tot }} </b-col>
                    <b-col class="col-5"> val% </b-col>
                </b-row>
            </b-container>
        </b-card>
    </div>
</template>


<script>
export default {
  name: 'nutrition_facts',
  data() {
    return {
      meals: [],
      meal: '',
    };
  },
  methods: {
    loadMeal() {
      // TODO: prendere username da sessione
      const usr = 'mrossi';
      const meal = 'Cena';
      const param = {
        username: usr,
        mealName: meal,
      };

      this.$http.get(`api/${param.username}/meals/${param.mealName}`, { params: param })
        .then((response) => {
          this.meals = response.data.meals;
          [this.meal] = this.meals;
        })
        .catch(error => (console.log(error)));
    },
    init() {
      this.loadMeal();
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
    "water_footprint_tot": "Water footprint"
  },
  "it": {
    "nutrition_facts": "Valori nutrizionali",
    "daily_value": "% Valore giornaliero",
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
    "water_footprint_tot": "Consumo d'Acqua"
  }
}
</i18n>

<style lang="sass">
  @import './nutrition_facts.sass'
</style>
