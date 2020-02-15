<template>
  <div class="meals">
    <h1 class="mealTitle"> {{ $t('your_meals') }} </h1>
    <b-card class="card-calendar p-0">
      <b-button @click="decrementDate" variant="link">
        <b-icon icon="chevron-left" font-scale="1.5" variant="info"></b-icon>
      </b-button>

      <v-date-picker v-model="calendar.value"
        :popover="{ placement: 'bottom', visibility: 'click' }"
        :masks="{ title: 'YYYY MMM' }"
        :locale='$root.$i18n.locale' :max-date="new Date()"
        :attributes="this.attributes"
        :is-dark="this.$store.state.darkMode"
        :is-required="true"
        @dayclick="setDateAndShowMeals">
        <p class="date-p text-center ">
          <b-icon icon="calendar" font-scale="1.5" variant="secondary"></b-icon>
          {{ $d(calendar.value, 'short') }}
        </p>
      </v-date-picker>

      <b-button :disabled="disableBtn" @click="incrementDate" variant="link">
        <b-icon icon="chevron-right" font-scale="1.5" :variant="arrowRightVariant"></b-icon>
      </b-button>

    </b-card>
    <div class="containerMeal">
      <b-tabs content-class="mt-3" id="myTabContent" justified>
        <b-tab :title="$t('meals')" class="tab-content-info" active>
          <b-card class="card-new-meal">
            <b-input-group class="input-new-meal mt-3">
              <b-form-input id="input-new-meal"
                v-model="mealName"
                :state="mealNameState"
                aria-describedby="input-live-feedback"
                :placeholder="$t('meal_name_enter')"
                @keyup.enter="addMeal(mealName)"
                trim
                @input="onMealNameChange"
              ></b-form-input>
              <b-input-group-append>
                <b-button variant="link"
                  class="plus-button p-0"
                  @click="addMeal(mealName)"
                ><b-icon icon="plus" font-scale="2"
                class="plus-icon p-0"></b-icon>
                </b-button>
              </b-input-group-append>
              <b-form-invalid-feedback id="input-live-feedback">
                {{ $t(inputCheckMessage) }}
              </b-form-invalid-feedback>
            </b-input-group>

          </b-card>

          <div v-if="mealsListByDate.length > 0"
            class="card-last-meals"
            role="tablist"
          ><b-card no-body class="mb-1"
              v-for="(meal, index) in mealsListByDate.slice().reverse()"
              v-bind:key="index"
            ><b-card-header header-tag="header" class="p-0" role="tab">
                <b-button class="headerTitle accordion-bgn" block href="#"
                v-b-toggle="'accordion-' + index" variant="success">
                  <p class="meal-name-p text-center m-0">{{ meal.meal_name }}</p>
                  <b-button :disabled="meal.components.length <= 0"
                    class="p-0 mr-3 accordion-bgn" variant="success"
                    @click="calculateMeal(meal.meal_name, meal.timestamp)"
                  ><b-icon icon="pie-chart-fill"
                    class="border border-light rounded p-1"
                    font-scale="2"></b-icon>
                  </b-button>
                  <b-button class="p-0 accordion-bgn" variant="success"
                    @click="deleteMealModal(meal.meal_name)"
                  ><b-icon icon="trash-fill"
                    class="border border-light rounded p-1"
                    font-scale="2">
                    ></b-icon>
                  </b-button>
                </b-button>
              </b-card-header>

            <b-collapse :id="'accordion-' + index" visible accordion="my-accordion" role="tabpanel">
              <b-card-body class="components-card">
                <b-button v-if="!meal.is_closed" variant="light"
                  class="add-component mb-3"
                  @click="addComponent(meal.meal_name, meal.timestamp)"
                ><b-icon icon="plus" variant="success" font-scale="2" shift-v="+2"></b-icon>
                  {{ $t('add_component') }}
                </b-button>
                <div v-if="meal.components.length > 0">
                  <div v-for="component in meal.components" v-bind:key="component.product_name">
                    <b-card class="card-components mb-2 pb-1 pl-0 pt-1 pr-1">
                      <div class="card-img-left">
                        <b-img :src="component.image_url" alt="Component Image" class="img-left">
                        </b-img>
                      </div>
                      <div align="center" class="card-components-text m-0 p-0">
                        <b-col>
                          <p class="component-p mb-1">
                            <b>
                              <b-link href="#"
                              @click="goToInfoProd(component.barcode,
                              meal.meal_name,
                              meal.timestamp)">
                                {{ component.product_name }}
                              </b-link>
                            </b>
                          </p>
                          <p class="component-p mb-1">
                            {{ component.quantity }} {{component.measure_unit}}
                          </p>
                          <p class="component-p mb-1">
                            {{ (component.energy_kcal).toFixed(2) }} kcal
                          </p>
                        </b-col>
                        <b-col class="nutri-img-div">
                          <b-img v-if="component.nutrition_score"
                            class="nutri-score-img"
                            :src='getNutriScoreImage(component.nutrition_score)'
                            alt="Nutri score image">
                          </b-img>
                        </b-col>
                      </div>
                        <div class="remove-btn-div">
                          <b-button v-if="!meal.is_closed"
                            class="remove-btn p-0"
                            variant="link"
                            @click="removeComponentModal(
                              component.barcode,
                              component.quantity,
                              meal.meal_name)"
                          ><b-icon icon="x-circle" variant="danger"></b-icon>
                          </b-button>
                        </div>
                    </b-card>
                  </div>
                  <b-button v-if="!meal.is_closed"
                    class="accordion-bgn mt-3"
                    variant="success"
                    @click="completeMealModal(meal)"
                  > {{ $t('complete_meal') }}
                  </b-button>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
        <div v-else class="mt-5">
          <b-icon icon="alert-triangle" scale="2" class="mb-3" color="slategrey"></b-icon>
          <p class="noMeals"> {{ $t(this.noMeals) }} </p>
          <p class="noMeals"> {{ $t("choose_name") }}</p>
          <p class="noMeals"> {{ $t("click_on_plus") }}</p>
        </div>
        <b-modal id="modal-ach" :title="$i18n.t('newAchievement')" hide-footer>
          <div class="d-block text-center">
            {{ this.achMsgModal }}
          </div>
          <b-button class="mt-3" block @click="hideAchModal">{{ $t('achModalBtn')}}</b-button>
        </b-modal>
      </b-tab>
      <b-tab :title="$t('meals_graph')" class="tab-content-info" @click="triggerChartTab">
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
  </div>
</template>

<script>
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

const imagesExt = '.svg';
const imagesContext = require.context('@/assets/productInfo/', true, /\.svg$/);

export default {
  name: 'meals',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      achMsgModal: '',

      // Meals
      mealsList: [],
      mealsListByDate: [],
      mealName: '',

      // Meal state
      noMeals: '',
      mealNameState: null,

      mealToClose: {},

      // Error messages
      inputCheckMessage: '',
      modalErrorMsg: '',

      // Dates
      currentDate: new Date(),
      UTCDate: Number,

      // DateTimePicker
      calendar: {
        key: 'calendar',
        value: undefined,
      },
      attributes: [
        {
          key: 'today',
          dot: {
            color: 'red',
            contentClass: 'italic', // Class provided by TailwindCSS
          },
        },
      ],
      options: {
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        useCurrent: false,
        showClear: false,
        showClose: true,
      },
      disableBtn: false,
      arrowRightVariant: 'info',


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

      // Graph
      series: [
        {
          name: '',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],

      chartOptions: {
        chart: {
          type: 'bar',
          height: 500,
          animations: {
            enabled: true,
            easing: 'linear',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 300,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
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
              if (y < 0) label = `${(y).toFixed(0)}%`;
              else {
                label = `+${(y).toFixed(0)}%`;
                if (y > 100) {
                  label = `Overrun 100% by +${(y - 100).toFixed(0)}%;`;
                }
              }
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
    // Main methods
    loadMealsList() {
      console.log(this.currentDate);

      const dateFromProductInfo = this.$route.query.date;
      console.log(`dateFromProductInfo ${dateFromProductInfo}`);

      if (dateFromProductInfo !== undefined) {
        this.currentDate = new Date(dateFromProductInfo);
        this.calendar.value = this.currentDate;
      } else {
        this.currentDate = new Date();
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

      if (this.currentDate.getDate() === this.options.maxDate.getDate()
        && this.currentDate.getMonth() === this.options.maxDate.getMonth()) {
        this.disableBtn = true;
        this.arrowRightVariant = 'light';
      } else {
        this.arrowRightVariant = 'info';
      }

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
    setDateAndShowMeals(day) {
      this.currentDate = day.date;
      console.log(`Current date: ${this.currentDate}`);
      this.showMealsByDate(this.currentDate);
      this.computeDayNutritionFact(this.currentDate);
      this.triggerChartTab();
    },
    incrementDate() {
      if (this.currentDate.getDate() + 1 === new Date().getDate()) {
        this.disableBtn = true;
      } else {
        this.disableBtn = false;
      }
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.calendar.value = this.currentDate;
      this.setDateAndShowMeals({ date: this.currentDate });
    },
    decrementDate() {
      this.disableBtn = false;
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.calendar.value = this.currentDate;
      this.setDateAndShowMeals({ date: this.currentDate });
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
      console.log('Chart tab triggered');
      this.$refs.barchart.refresh();
      setTimeout(() => {
        this.$refs.barchart.updateSeries([{ name: '', data: this.nutritionValues }]);
      }, 500);
    },
    goToInfoProd(barcode, mealName, timeStamp) {
      this.$root.$emit('selectProduct', barcode, mealName, timeStamp);
    },
    removeComponentModal(barcode, quantity, mealName) {
      this.$bvModal.msgBoxConfirm(this.$i18n.t('confirm_component_deletion'), {
        title: this.$i18n.t('delete_component'),
        id: 'deleteModal',
        okVariant: 'success',
        okTitle: this.$i18n.t('yes'),
        cancelTitle: this.$i18n.t('no'),
        footerClass: 'p-2',
        hideHeaderClose: false,
      })
        .then((value) => {
          if (value === true) this.removeComponent(barcode, quantity, mealName);
          else console.log('Componente non cancellato');
        })
        .catch((err) => {
          console.log(err);
          // An error occurred
        });
    },
    deleteMealModal(meal) {
      this.$bvModal.msgBoxConfirm(this.$i18n.t('confirm_meal_deletion'), {
        title: this.$i18n.t('delete_meal'),
        id: 'deleteModal',
        okVariant: 'success',
        okTitle: this.$i18n.t('yes'),
        cancelTitle: this.$i18n.t('no'),
        footerClass: 'p-2',
        hideHeaderClose: false,
      })
        .then((value) => {
          if (value === true) this.removeMeal(meal);
          else console.log('pasto non cancellato');
        })
        .catch((err) => {
          console.log(err);
          // An error occurred
        });
    },

    // Utils
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
          this.$root.$emit('openModalError', 'DefaultTitle', this.modalErrorMsg);
        } else if (errorDescription === 'internal_server_error'
          || errorDescription === 'meal_not_found'
          || errorDescription === 'user_not_found') {
          this.modalErrorMsg = errorDescription;
          this.$root.$emit('openModalError', 'DefaultTitle', this.modalErrorMsg);
        } else if (errorDescription === 'mealslist_not_found') {
          this.noMeals = 'no_meals';
        } else this.inputCheckMessage = errorDescription;
      }
    },
    getNutriScoreImage(nutriScore) {
      return nutriScore ? imagesContext(`./nutriScore/${nutriScore}${imagesExt}`) : '';
    },
    completeMealModal(meal) {
      this.$bvModal.msgBoxConfirm(this.$i18n.t('save_meal'), {
        title: this.$i18n.t('complete_meal'),
        okVariant: 'primary',
        id: 'completeMeal',
        okTitle: this.$i18n.t('yes'),
        cancelTitle: this.$i18n.t('no'),
        footerClass: 'p-2',
        hideHeaderClose: false,
      })
        .then((value) => {
          if (value === true) this.saveMeal(meal);
          else console.log('pasto non salvato');
        })
        .catch((err) => {
          console.log(err);
          // An error occurred
        });
    },
    saveMeal(meal) {
      this.mealToClose = meal;
      this.mealToClose.is_closed = true;
      console.log(this.mealToClose.is_closed);
      const body = this.mealToClose;

      console.log(body); // DEBUG
      this.$store.state.http.put(`api/meals/${body.meal_name}/${body.timestamp}`, body)
        .then((response) => {
          this.mealsList = [];
          console.log('saveMeal response: ');
          console.log(response.data);
          this.mealsList = response.data.userMeals.meals;
          this.showMealsByDate(this.currentDate);
          const c = response.data.countNewAch;
          if (c > 0) {
            // new achievements, show modal
            this.achMsgModal = `${c} ${this.$i18n.t('newAchTxt')}`;
            this.$bvModal.show('modal-ach');
          }
        })
        .catch(error => this.checkError(error.response.data.description));
    },
    hideAchModal() {
      this.$bvModal.hide('modal-ach');
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
    "no_meals": "No meals inserted on this date yet\n",
    "choose_name": "1. Choose a name.",
    "click_on_plus": "2. Click on + button to insert it.",
    "error_meals": "Error!",
    "complete_meal": "Complete meal",
    "save_meal": "If you complete the meal you will not be able to edit it again.\nConfirm?",
    "delete_meal": "Delete meal?",
    "delete_component": "Remove component?",
    "confirm_meal_deletion": "If you delete the meal you can no longer recover it.\nConfirm?",
    "confirm_component_deletion": "If you remove this component you can not go back.\nConfirm?",
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
    },
    "newAchTxt": "new achievements!",
    "achModalBtn": "Great!",
    "newAchievement": "New achievement"
  },
  "it": {
    "your_meals": "I tuoi pasti",
    "meal_name_enter": "Inserire nome pasto",
    "add_component": "Aggiungi componente",
    "date": "Data",
    "calculate_meal": "Calcola pasto",
    "meal_name_null": "Il nome del pasto non può essere nullo",
    "no_meals": "Non sono ancora stati inseriti pasti in questa data.\n",
    "choose_name": "1. Scegli un nome.",
    "click_on_plus": "2. Clicca sul + per aggiungerlo.",
    "error_meals": "Errore!",
    "complete_meal": "Completa il pasto",
    "save_meal": "Se completi il pasto non potrai più modificarlo\nConfermi?",
    "delete_meal": "Eliminare pasto?",
    "delete_component": "Rimuovere componente?",
    "confirm_meal_deletion": "Se elimini il pasto non lo potrai più recuperare\n Confermi?",
    "confirm_component_deletion": "Se rimuovi il componente non puoi tornare indietro.\n Confermi?",
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
    },
    "newAchTxt": "nuovi obiettivi raggiunti!",
    "achModalBtn": "Fantastico!",
    "newAchievement": "Nuovi obiettivi raggiunti"
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
