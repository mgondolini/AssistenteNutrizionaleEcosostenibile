<template>
  <div class="meals">
    <h1> {{ $t('meals') }} </h1>
    <b-card class="card-calendar p-0">
      <p class="date-p text-center">{{ $d(currentDate, 'short') }}</p>
      <b-button
        variant="outline-info p-0"
        @click="$refs.calendar.dp.show()"
      ><img class="calendar" src="../../assets/buttons/calendar.svg">
      </b-button>
      <date-picker v-model="calendar.value"
        ref="calendar"
        :config="options"
        value="calendar"
        class="meals-datepicker"
        @dp-change="setDateAndShow(calendar.value)"> </date-picker>
    </b-card>
    <b-tabs content-class="mt-3">
      <b-tab title="Meals" active>
        <b-card class="card-new-meal">
          <b-form-input
            id="input-new-meal"
            v-model="mealName"
            :state="mealNameState"
            aria-describedby="input-live-feedback"
            :placeholder="$t('meal_name_enter')"
            class="input-new-meal"
            trim
          ></b-form-input>
          <b-button
            pill
            variant="link"
            class="button-add p-0"
            @click="addMeal(mealName)"
          >
          <img class="add-meal" src="../../assets/buttons/add.svg">
          </b-button>
          <b-form-invalid-feedback id="input-live-feedback">
            {{ $t(inputCheckMessage) }}
          </b-form-invalid-feedback>
        </b-card>
        <div
          v-if="mealsListByDate.length > 0"
          class="card-last-meals"
          role="tablist"
        >
          <b-card
            no-body class="mb-1"
            v-for="(meal, index) in mealsListByDate.slice().reverse()"
            v-bind:key="index"
          >
            <b-card-header header-tag="header" class="p-0" role="tab">
              <b-button block href="#" v-b-toggle="'accordion-' + index" variant="info">
                <p class="meal-name-p text-center m-0">{{ meal.meal_name }}</p>
                <b-button
                  class="p-0"
                  variant="outline-light p-0"
                  @click="removeMeal(meal.meal_name)"
                ><img class="trashcan" src="../../assets/buttons/trashcan.svg"></b-button>
              </b-button>
            </b-card-header>
            <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-button
                  v-if="!meal.is_closed"
                  pill
                  variant="link"
                  class="add-component p-0"
                  @click="addComponent(meal.meal_name, meal.timestamp)"
                >
                  <img class="add mr-2" src="../../assets/buttons/plus.svg">
                  {{ $t('add_component') }}
                </b-button>
                <div v-if="meal.components.length > 0">
                  <div v-for="component in meal.components" v-bind:key="component.product_name">
                    <b-card
                      :img-src="component.image_url"
                      img-alt="Card image" img-left
                      class="card-components mb-3"
                    >
                      <b-card-text align="center" class="card-components-text m-0 p-0">
                        <p class="component-p">
                          <b><a :href="'/info_prod?ean='+component.barcode">
                            {{ component.product_name }}
                          </a></b>
                        </p>
                        <p class="component-p">
                          {{ component.quantity }} g
                        </p>
                        <p class="component-p">
                          {{ component.energy_per_quantity }} kcal
                        </p>
                      </b-card-text>
                      <b-button
                        v-if="!meal.is_closed"
                        pill
                        variant="link"
                        class="p-0"
                        @click="removeComponent(component.barcode, meal.meal_name)"
                      ><img class="remove" src="../../assets/buttons/remove.svg">
                      </b-button>
                      <b-img v-if="component.nutrition_score"
                        :src='getNutriScoreImage(component.nutrition_score)'
                        alt="Nutri score image">
                      </b-img>
                    </b-card>
                  </div>
                  <b-button
                    variant="info"
                    @click="calculateMeal(meal.meal_name, meal.timestamp)"
                  >
                    {{ $t('calculate_meal') }}
                  </b-button>
                  <b-button
                    v-if="!meal.is_closed"
                    variant="info"
                    @click="completeMeal(meal)"
                  >
                    {{ $t('complete_meal') }}
                  </b-button>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
        <div v-else>
          <p>{{ $t(this.noMeals) }}</p>
        </div>
        <b-modal id="modal-error" :title="$t('error_meals')" hide-footer>
          <div class="d-block text-center">
            <img src="https://img.icons8.com/color/48/000000/restriction-shield.png">
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
      <b-tab title="Graph">
        <div class="chart-box">
          <div id="chart-bar">
            <apexchart
              type="bar"
              height="400"
              :options="chartOptions"
              :series="series">
            </apexchart>
          </div>
        </div>
      </b-tab>
    </b-tabs>
    <addProduct ref="addProduct"></addProduct>
  </div>
</template>

<script>
import Vue from 'vue';
import datePicker from 'vue-bootstrap-datetimepicker';
import VueApexCharts from 'vue-apexcharts';
import addProduct from '../../components/AddProduct/AddProduct.vue';

Vue.use(VueApexCharts);

const imagesExt = '.svg';
const imagesContext = require.context('@/assets/productInfo/', true, /\.svg$/);

export default {
  name: 'meals',
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
        useCurrent: false,
        showClear: false,
        showClose: true,
      },

      // Daily nutrition values
      todayNutritionValues: {
        // energy: 0,
        calories: 0,
        protein: 0,
        carbohydrate: 0,
        fiber: 0,
        total_fat: 0,
        saturated_fat: 0,
        calcium: 0,
        sodium: 0,
      },

      // Graph data
      dailyRequirement: Object,
      todayValues: [],
      todayKeys: [],


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
                  to: 500,
                  color: '#F15B46', // rosso
                },
              ],
            },
            columnWidth: '80%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: 'Daily Requirement',
          },
        },
        xaxis: {
          categories: ['calories', 'protein', 'carbohydrate', 'fiber', 'total_fat', 'saturated_fat', 'calcium', 'sodium'],
        },
      },
    };
  },
  components: {
    datePicker,
    apexchart: VueApexCharts,
    addProduct,
  },
  methods: {
    loadMealsList() {
      console.log(this.currentDate); // DEBUG

      this.$store.state.http.get(`api/meals/${this.currentDate}`)
        .then((response) => {
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          this.getGraphData();
        })
        .catch(error => this.checkError(error.response.data.description));
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
          })
          .catch((error) => {
            this.mealNameState = false;
            this.checkError(error.response.data.description);
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
        .catch(error => this.checkError(error.response.data.description));
    },
    addComponent(mealName, timestamp) {
      this.$refs.addProduct.open(mealName, timestamp);
    },
    removeComponent(barcode, mealName) {
      const params = {
        barcode,
        mealName,
        date: new Date(this.UTCDate),
      };

      console.log(params); // DEBUG
      this.$store.state.http.delete(`api/meals/${params.mealName}/${params.date}/components`, { params })
        .then((response) => {
          this.mealsList = [];
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          console.log(`component removed ${this.mealsList}`); // DEBUG
        })
        .catch(error => this.checkError(error.response.data.description));
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
      this.showMealsByDate(this.currentDate);
    },
    checkDates(d1, d2) {
      return (d1.getDate() === d2.getDate()
            && d1.getMonth() === d2.getMonth()
            && d1.getFullYear() === d2.getFullYear());
    },
    checkError(error) {
      if (error === 'internal_server_error' || error === 'meal_not_found' || 'user_not_found') {
        this.modalErrorMsg = error;
        this.$bvModal.show('modal-error');
      } else if (error === 'mealslist_not_found') {
        this.noMeals = 'no_meals';
      } else this.inputCheckMessage = error;
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
    getGraphData() {
      this.$store.state.http.get('/api/user')
        .then((response) => {
          this.dailyRequirement = response.data.daily_requirement;
          console.log('Daily Requirement'); // DEBUG
          console.log(this.dailyRequirement);
          this.getDayNutritionFact(this.currentDate);
        })
        .catch(error => this.checkError(error.response.data.description));
    },
    getDayNutritionFact(date) {
      console.log('Get nutrition fact');
      let mealDate;

      this.mealsList.forEach((meal) => {
        mealDate = new Date(meal.timestamp);
        if (this.checkDates(mealDate, date)) {
          // Sum of the nutrition values of the meals on a date
          this.todayNutritionValues.calories += meal.calories_tot;
          this.todayNutritionValues.carbohydrate += meal.carbohydrates_tot;
          this.todayNutritionValues.protein += meal.protein_tot;
          this.todayNutritionValues.fiber += meal.fiber_tot;
          this.todayNutritionValues.total_fat += meal.fat_tot;
          this.todayNutritionValues.saturated_fat += meal.saturated_fat_tot;
          this.todayNutritionValues.calcium += meal.calcium_tot;
          this.todayNutritionValues.sodium += meal.sodium_tot;
        }
      });

      let dailyRequirementValues = Object.values(this.dailyRequirement);
      dailyRequirementValues = dailyRequirementValues.splice(3, 10);

      this.todayKeys = Object.keys(this.todayNutritionValues);
      console.log('todayKeys');
      console.log(this.todayKeys);

      let todayValues = Object.values(this.todayNutritionValues);
      todayValues = todayValues
        .map((val, i) => this.getDailyNutritionRatio(val, dailyRequirementValues[i]))
        .map(val => (val - 100).toFixed(2));

      console.log('todayValues mapped');
      console.log(todayValues);

      this.series[0].data = todayValues;
      this.chartOptions.xaxis.categories = this.todayKeys;
      console.log(`categories ${this.chartOptions.xaxis.categories}`);
    },
    getDailyNutritionRatio(value, dailyRequirement) {
      return (value / dailyRequirement) * 100;
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
    "meals": "Your meals",
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
    "no": "No"
  },
  "it": {
    "meals": "I tuoi pasti",
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
    "no": "No"
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
