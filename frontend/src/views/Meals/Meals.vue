<template>
  <div class="meals">
    <h1> {{ $t('your_meals') }} </h1>
    <b-card class="card-calendar p-0">
      <p class="date-p text-center">{{ $d(currentDate, 'short') }}</p>
      <b-button variant="link"
        @click="$refs.calendar.dp.show()"
      ><b-icon icon="calendar" font-scale="1.5" variant="secondary"></b-icon>
      </b-button>
      <date-picker v-model="calendar.value"
        ref="calendar"
        :config="options"
        value="calendar"
        class="meals-datepicker"
        @dp-change="setDateAndShow(calendar.value)"> </date-picker>
    </b-card>

    <b-tabs content-class="mt-3" justified>
      <b-tab :title="$t('meals')" active>

        <b-card class="card-new-meal">
          <b-form-input id="input-new-meal"
            v-model="mealName"
            :state="mealNameState"
            aria-describedby="input-live-feedback"
            :placeholder="$t('meal_name_enter')"
            class="input-new-meal"
            trim
            @input="onMealNameChange"
          ></b-form-input>
          <b-button variant="link"
            class="button-add p-0"
            @click="addMeal(mealName)"
          ><b-icon icon="plus" variant="info" font-scale="2.3"
          class="border border-info rounded p-0"></b-icon>
          </b-button>
          <b-form-invalid-feedback id="input-live-feedback">
            {{ $t(inputCheckMessage) }}
          </b-form-invalid-feedback>
        </b-card>

        <div v-if="mealsListByDate.length > 0"
          class="card-last-meals"
          role="tablist"
        ><b-card no-body class="mb-1"
            v-for="(meal, index) in mealsListByDate.slice().reverse()"
            v-bind:key="index"
          ><b-card-header header-tag="header" class="p-0" role="tab">
              <b-button block href="#" v-b-toggle="'accordion-' + index" variant="info">
                <p class="meal-name-p text-center m-0">{{ meal.meal_name }}</p>
                <b-button class="p-0 mr-2" variant="info"
                  @click="calculateMeal(meal.meal_name, meal.timestamp)"
                ><b-icon icon="pie-chart-fill"
                  class="border border-light rounded p-1"
                  font-scale="2"></b-icon>
                </b-button>
                <b-button class="p-0" variant="info"
                  @click="removeMeal(meal.meal_name)"
                ><b-icon icon="trash-fill"
                  class="border border-light rounded p-1"
                  font-scale="2">
                  ></b-icon>
                </b-button>
              </b-button>
            </b-card-header>

            <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
              <b-card-body class="components-card">
                <b-button v-if="!meal.is_closed"
                  variant="link"
                  class="add-component border-info"
                  @click="addComponent(meal.meal_name, meal.timestamp)"
                ><b-icon icon="plus" variant="success" font-scale="2" shift-v="+2"></b-icon>
                  <p color="info">{{ $t('add_component') }}</p>
                </b-button>
                <div v-if="meal.components.length > 0">
                  <div v-for="component in meal.components" v-bind:key="component.product_name">
                    <b-card :img-src="component.image_url"
                      img-alt="Card image" img-left
                      class="card-components mb-3"
                    ><b-card-text align="center" class="card-components-text m-0 p-0">
                        <p class="component-p">
                          <b><a :href="'/info_prod?ean='+component.barcode">
                            {{ component.product_name }}
                          </a></b>
                        </p>
                        <p class="component-p">
                          {{ component.quantity }} {{component.measure_unit}}
                        </p>
                        <p class="component-p">
                          {{ (component.energy_kcal).toFixed(2) }} kcal
                        </p>
                      </b-card-text>
                      <b-img v-if="component.nutrition_score"
                        class="nutri-score-img"
                        :src='getNutriScoreImage(component.nutrition_score)'
                        alt="Nutri score image">
                      </b-img>
                      <b-button v-if="!meal.is_closed"
                        class="remove-btn p-0"
                        variant="link"
                        @click="removeComponent(
                          component.barcode,
                          component.quantity,
                          meal.meal_name)"
                      ><b-icon icon="x-circle" variant="danger"></b-icon>
                      </b-button>
                    </b-card>
                  </div>
                  <b-button v-if="!meal.is_closed"
                    variant="info"
                    @click="completeMeal(meal)"
                  > {{ $t('complete_meal') }}
                  </b-button>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
        <div v-else><p>{{ $t(this.noMeals) }}</p></div>

        <b-modal id="modal-error" :title="$t('error_meals')" hide-footer>
          <div class="d-block text-center">
            <b-icon icon="alert-triangle" variant="danger" scale="2"></b-icon>
            {{ $t(this.modalErrorMsg) }}
          </div>
        </b-modal>

        <b-modal ref="modal-save" :title="$t('complete_meal')" hide-footer>
          <div class="p-0 text-center">
            {{ $t('save_meal') }}
          </div>
          <footer class="modal-footer p-0">
            <b-button variant="secondary" @click="hideModal">
              {{$t('no')}}
            </b-button>
            <b-button variant="primary" @click="saveMeal()">
              {{$t('yes')}}
            </b-button>
          </footer>
        </b-modal>
      </b-tab>

      <b-tab :title="$t('meals_graph')" @click="triggerChartTab">
        <div class="chart-box">
          <div id="chart-bar">
            <apexchart
              type="bar"
              ref="barchart"
              height="400"
              :options="chartOptions"
              :series="series">
            </apexchart>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import datePicker from 'vue-bootstrap-datetimepicker';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

const imagesExt = '.svg';
const imagesContext = require.context('@/assets/productInfo/', true, /\.svg$/);

export default {
  name: 'meals',
  components: {
    datePicker,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      // Meals
      mealsList: [],
      mealsListByDate: [],
      mealName: '',

      // Meal state
      noMeals: '',
      mealNameState: null,

      // Error messages
      inputCheckMessage: '',
      modalErrorMsg: '',

      // Dates
      currentDate: new Date(),
      UTCDate: Number,

      // DateTimePicker
      calendar: {
        key: 'calendar',
        value: '',
      },
      options: {
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        useCurrent: false,
        showClear: false,
        showClose: true,
      },

      // Daily nutrition values
      nutritionFact: {
        energy_kcal: 0,
        proteins: 0,
        carbohydrates: 0,
        fibers: 0,
        total_fats: 0,
        saturated_fats: 0,
        calcium: 0,
        sodium: 0,
      },

      // Graph data
      dailyRequirement: Object,
      nutritionValues: [],
      nutritionKeys: [],
      mealFound: Boolean,

      // Graph
      series: [
        {
          name: '',
          data: [],
        },
      ],

      chartOptions: {
        chart: {
          type: 'bar',
          height: 500,
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  to: -75,
                  color: '#F15B46', // rosso
                },
                {
                  from: -75,
                  to: -10,
                  color: '#FEB019', // arancio
                },
                {
                  from: -10,
                  to: 10,
                  color: '#679c4d', // verde
                },
                {
                  from: 10,
                  to: 25,
                  color: '#FEB019', // arancio
                },
                {
                  from: 25,
                  to: 1000,
                  color: '#F15B46', // rosso
                },
              ],
            },
            columnWidth: '50%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: this.$i18n.t('overrun'),
          },
          min: -100,
          max: 100,
          labels: {
            formatter(y) {
              let label = 0;
              if (y < 0) {
                // if (y === -100) label = `${0}%`;
                label = `${(y).toFixed(0)}%`;
              } else label = `+${(y).toFixed(0)}%`;
              return label;
            },
          },
        },
        xaxis: {
          categories: [
            this.$i18n.t('nutritionFact.energy_kcal'),
            this.$i18n.t('nutritionFact.proteins'),
            this.$i18n.t('nutritionFact.carbohydrates'),
            this.$i18n.t('nutritionFact.fibers'),
            this.$i18n.t('nutritionFact.total_fats'),
            this.$i18n.t('nutritionFact.saturated_fats'),
            this.$i18n.t('nutritionFact.calcium'),
            this.$i18n.t('nutritionFact.sodium'),
          ],
        },
      },
    };
  },
  methods: {
    loadMealsList() {
      console.log(this.currentDate);

      const dateFromProductInfo = this.$route.query.date;
      console.log(`dateFromProductInfo ${dateFromProductInfo}`);

      if (dateFromProductInfo !== undefined) {
        this.currentDate = new Date(dateFromProductInfo);
        this.calendar.value = this.currentDate;
      }

      this.$store.state.http.get(`api/meals/${this.currentDate}`)
        .then((response) => {
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          this.getUserDailyRequirement();
        })
        .catch(error => this.checkError(error));
    },
    addMeal(mealName) {
      this.UTCDate = Date.UTC(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate(),
      );

      const body = {
        meals: {
          mealName,
          timestamp: new Date(this.UTCDate),
        },
      };

      if (mealName.length > 0) {
        this.$store.state.http.post(`api/meals/${body.meals.timestamp}`, body)
          .then((response) => {
            this.mealNameState = true;
            this.mealsList = [];
            this.mealsList = response.data.meals;
            this.showMealsByDate(this.currentDate);
            this.computeDayNutritionFact(this.currentDate);
          })
          .catch((error) => {
            this.mealNameState = false;
            this.checkError(error);
          });
      } else {
        this.mealNameState = false;
        this.inputCheckMessage = 'meal_name_null';
      }
    },
    removeMeal(mealName) {
      const params = {
        mealName,
        date: new Date(this.UTCDate),
      };

      console.log(`remove meal ${JSON.stringify(params)}`); // DEBUG

      this.$store.state.http.delete(`api/meals/${params.mealName}/${params.date}`, { params })
        .then(() => this.loadMealsList())
        .catch(error => this.checkError(error));
    },
    addComponent(mealName, timestamp) {
      this.$root.$emit('openProductSelection', mealName, timestamp);
    },
    removeComponent(barcode, quantity, mealName) {
      const params = {
        barcode,
        quantity,
        mealName,
        date: new Date(this.UTCDate),
      };

      console.log(params); // DEBUG
      this.$store.state.http.delete(`api/meals/${params.mealName}/${params.date}/components`, { params })
        .then((response) => {
          this.mealsList = [];
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          this.computeDayNutritionFact(this.currentDate);
        })
        .catch(error => this.checkError(error));
    },
    calculateMeal(mealName, timestamp) {
      this.$router.push({ path: '/calculate_meal_composition', query: { mealName, date: timestamp } });
    },
    showMealsByDate(date) {
      let mealDate;
      let found = false;
      this.mealsListByDate = [];

      this.UTCDate = Date.UTC(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate(),
      );

      this.mealsList.forEach((meal) => {
        mealDate = new Date(meal.timestamp);

        if (this.checkDates(mealDate, date)) {
          this.mealsListByDate.push(meal);
          found = true;
        } else found = false;
      });

      if (!found) this.noMeals = 'no_meals';
    },
    setDateAndShow(date) {
      this.currentDate = new Date(date);
      console.log(`Current date: ${this.currentDate}`);
      this.showMealsByDate(this.currentDate);
      this.computeDayNutritionFact(this.currentDate);
    },
    getUserDailyRequirement() {
      this.$store.state.http.get('/api/user')
        .then((response) => {
          this.dailyRequirement = response.data.daily_requirement;
          console.log('Daily Requirement'); // DEBUG
          console.log(this.dailyRequirement); // DEBUG
          this.computeDayNutritionFact(this.currentDate);
        })
        .catch(error => this.checkError(error));
    },
    computeDayNutritionFact(date) {
      console.log('Get nutrition fact'); // DEBUG
      let mealDate;

      this.initNutritionFact();

      this.mealsList.forEach((meal) => {
        mealDate = new Date(meal.timestamp);
        if (this.checkDates(mealDate, date)) {
          // Sum the nutrition values of the meals eaten on a certain date
          this.nutritionFact.energy_kcal += meal.energy_kcal_tot;
          this.nutritionFact.proteins += meal.proteins_tot;
          this.nutritionFact.carbohydrates += meal.carbohydrates_tot;
          this.nutritionFact.fibers += meal.fiber_tot;
          this.nutritionFact.total_fats += meal.fat_tot;
          this.nutritionFact.saturated_fats += meal.saturated_fat_tot;
          this.nutritionFact.calcium += meal.calcium_tot;
          this.nutritionFact.sodium += meal.sodium_tot;
        }
      });

      let dailyRequirementValues = Object.values(this.dailyRequirement);
      dailyRequirementValues = dailyRequirementValues.splice(3, 10);
      console.log(this.dailyRequirement);
      console.log('dailyRequirementValues');
      console.log(dailyRequirementValues);

      this.nutritionKeys = Object.keys(this.nutritionFact);
      console.log('nutritionKeys');
      console.log(this.nutritionKeys);

      this.nutritionValues = Object.values(this.nutritionFact);
      console.log('nutritionValues');
      console.log(this.nutritionValues);

      this.nutritionValues = this.nutritionValues
        .map((val, i) => this.getDailyNutritionRatio(val, dailyRequirementValues[i]))
        .map(val => (val - 100).toFixed(2));

      console.log('nutritionValues mapped');
      console.log(this.nutritionValues);
    },
    triggerChartTab() {
      console.log('Tab triggered');
      this.$refs.barchart.refresh();
      this.$refs.barchart.updateSeries([{ name: '', data: this.nutritionValues }]);
    },
    getDailyNutritionRatio(value, dailyRequirement) {
      return (value / dailyRequirement) * 100;
    },
    initNutritionFact() {
      this.nutritionFact = {
        energy_kcal: 0,
        proteins: 0,
        carbohydrates: 0,
        fibers: 0,
        total_fats: 0,
        saturated_fats: 0,
        calcium: 0,
        sodium: 0,
      };
      return this.nutritionFact;
    },
    checkDates(d1, d2) {
      return (d1.getDate() === d2.getDate()
            && d1.getMonth() === d2.getMonth()
            && d1.getFullYear() === d2.getFullYear());
    },
    checkError(error) {
      let errorStatus;
      let errorDescription;

      if (error.response !== undefined) {
        errorStatus = error.response.status;
        errorDescription = error.response.data.description;

        if (errorStatus === 401) {
          this.modalErrorMsg = 'unauthorized';
          this.$bvModal.show('modal-error');
        } else if (errorDescription === 'internal_server_error'
          || errorDescription === 'meal_not_found'
          || errorDescription === 'user_not_found') {
          this.modalErrorMsg = errorDescription;
          this.$bvModal.show('modal-error');
        } else if (errorDescription === 'mealslist_not_found') {
          this.noMeals = 'no_meals';
        } else this.inputCheckMessage = errorDescription;
      }
    },
    getNutriScoreImage(nutriScore) {
      return nutriScore ? imagesContext(`./nutriScore/${nutriScore}${imagesExt}`) : '';
    },
    completeMeal(meal) {
      this.mealToClose = meal;
      this.$refs['modal-save'].show();
    },
    saveMeal() {
      this.mealToClose.is_closed = true;
      console.log(this.mealToClose.is_closed);
      const body = this.mealToClose;

      console.log(body); // DEBUG
      this.$store.state.http.put(`api/meals/${body.meal_name}/${body.timestamp}`, body)
        .then((response) => {
          this.mealsList = [];
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          this.hideModal();
        })
        .catch(error => this.checkError(error.response.data.description));
    },
    hideModal() {
      this.$refs['modal-save'].hide();
    },
    onMealNameChange() {
      if (this.mealName.length === 0) this.mealNameState = null;
    },
  },
  mounted() {
    this.loadMealsList();
  },
};
</script>

<i18n src='../../locales/errorMessages.json'></i18n>
<i18n>
{
  "en": {
    "your_meals": "Your meals",
    "add_component": "Add component",
    "meal_name_enter": "Enter meal name",
    "date": "Date",
    "calculate_meal": "Calculate meal",
    "meal_name_null": "Meal name cannot be null",
    "no_meals": "No meals inserted on this date yet",
    "error_meals": "Error!",
    "complete_meal": "Complete meal",
    "save_meal": "If you complete the meal you will not be able to edit it again.\nConfirm?",
    "yes": "Yes",
    "no": "No",
    "overrun": "Overrun Daily Value %",
    "meals": "Meals",
    "meals_graph": "Daily requirement",
    "nutritionFact": {
      "energy_kj": "Energy_kj",
      "energy_kcal" : "Energy_kcal",
      "carbohydrates": "Carbohydrates",
      "proteins": "Proteins",
      "fibers": "Fibers",
      "total_fats": "Fats",
      "saturated_fats": "Saturated_fats",
      "calcium": "Calcium",
      "sodium": "Sodium"
    }
  },
  "it": {
    "your_meals": "I tuoi pasti",
    "meal_name_enter": "Inserire nome pasto",
    "add_component": "Aggiungi componente",
    "date": "Data",
    "calculate_meal": "Calcola pasto",
    "meal_name_null": "Il nome del pasto non può essere nullo",
    "no_meals": "Non sono ancora stati inseriti pasti in questa data",
    "error_meals": "Errore!",
    "complete_meal": "Completa il pasto",
    "save_meal": "Se completi il pasto non potrai più modificarlo\nConfermare?",
    "yes": "Si",
    "no": "No",
    "overrun": "Superamento del fabbisogno giornaliero %",
    "meals": "Pasti",
    "meals_graph": "Fabbisogno giornaliero",
    "nutritionFact": {
      "energy_kj": "Energia_kj",
      "energy_kcal": "Energia_kcal",
      "carbohydrates": "Carboidrati",
      "proteins": "Proteine",
      "fibers": "Fibre",
      "total_fats": "Grassi",
      "saturated_fats": "Grassi_saturi",
      "calcium": "Calcio",
      "sodium": "Sodio"
    }
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
