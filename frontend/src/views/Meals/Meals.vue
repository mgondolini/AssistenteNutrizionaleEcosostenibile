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
      <b-form-invalid-feedback id="input-live-feedback">
        {{ inputCheckMessage }}
      </b-form-invalid-feedback>
      <b-button
        pill
        variant="link"
        class="button-add p-0"
        @click="addMeal(mealName)"
      ><img class="add-meal" src="../../assets/buttons/add.svg">
      </b-button>
    </b-card>
    <div class="card-last-meals" role="tablist">
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
              pill
              variant="link"
              class="add-component p-0"
              @click="addComponent(meal.meal_name)"
            > <!--TODO aggiungere bottone CalculateMeal -->
              <img class="add mr-2" src="../../assets/buttons/plus.svg">
              {{ $t('add_component') }}
            </b-button>
            <div v-for="component in meal.components" v-bind:key="component.product_name">
              <b-card
                :img-src="component.image_url"
                img-alt="Card image" img-left
                class="card-components mb-3"
              >
                <b-card-text align="center" class="card-components-text m-0 p-0">
                  <p class="component-p">
                    <b> {{ component.product_name }} </b>
                  </p>
                  <p class="component-p">
                    {{ component.quantity }} g
                  </p>
                </b-card-text>
                <b-button
                  pill
                  variant="link"
                  class="p-0"
                  @click="removeComponent(component.barcode, meal.meal_name)"
                ><img class="remove" src="../../assets/buttons/remove.svg">
                </b-button>
              </b-card>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker';

export default {
  name: 'meals',
  data() {
    return {
      mealsList: [],
      mealsListByDate: [],
      mealNameState: Boolean,
      currentDate: new Date(),
      UTCDate: Number,
      mealName: '',
      inputCheckMessage: 'Enter at least 3 letters',
      date: {
        key: 'date',
        value: '',
      },
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
    };
  },
  components: {
    datePicker,
  },
  methods: {
    loadMealsList() {
      // TODO: prendere username da sessione
      const username = 'mrossi';
      const params = { username };

      this.$store.state.http.get(`api/${params.username}/meals`, { params })
        .then((response) => {
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
        })
        .catch(error => console.log(error.response.data.description));
    },
    addMeal(mealName) {
      const username = 'mrossi';
      const body = {
        username, // username da sessione
        meals: {
          mealName,
          timestamp: new Date(this.UTCDate),
        },
      };
      console.log(body); // DEBUG
      if (mealName.length !== 0) {
        this.$store.state.http.post(`api/${body.username}/meals`, body)
          .then((response) => {
            this.mealsList = [];
            this.mealsList = response.data.meals;
            this.showMealsByDate(this.currentDate);
          })
          .catch((error) => {
            this.mealNameState = false;
            this.inputCheckMessage = error.response.data.description;
          }); // mostrare su una label
      } else {
        this.mealNameState = false;
        this.inputCheckMessage = 'Meal name cannot be null';
      }
    },
    removeMeal(mealName) {
      const username = 'mrossi';
      const params = {
        username,
        mealName,
        date: new Date(this.UTCDate),
      };

      console.log(`remove${JSON.stringify(params)}`); // DEBUG

      this.$store.state.http.delete(`api/${params.username}/meals/${params.mealName}`, { params })
        .then(() => this.loadMealsList())
        .catch(error => console.log(error.response.data.description));
    },
    addComponent(mealName) {
      // Passo meal name, per accedere alla query dalla pagina info prodotto
      // devo fare: this.$route.query.mealName
      this.$router.push({ path: '/info_prod', query: { mealName } });
    },
    removeComponent(barcode, mealName) {
      const username = 'mrossi';
      const params = {
        username,
        barcode,
        mealName,
        date: new Date(this.UTCDate),
      };

      console.log(params); // DEBUG
      this.$store.state.http.delete(`api/${params.username}/meals/${params.mealName}/components`, { params })
        .then((response) => {
          this.mealsList = [];
          this.mealsList = response.data.meals;
          this.showMealsByDate(this.currentDate);
          console.log(`component removed ${this.mealsList}`); // DEBUG
        })
        .catch(error => console.log(error.response.data.description));
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

        if (mealDate.getDate() === date.getDate()
            && mealDate.getMonth() === date.getMonth()
            && mealDate.getFullYear() === date.getFullYear()) {
          this.mealsListByDate.push(meal);
          found = true;
        } else {
          found = false;
        }
      });

      if (found === false) {
        console.log('No meals yet for today'); // LABEL
      }
    },
    setDateAndShow(date) {
      this.currentDate = new Date(date);
      this.showMealsByDate(this.currentDate);
    },
  },
  mounted() {
    this.loadMealsList();
  },
};
</script>


<i18n>
{
  "en": {
    "meals": "Your meals",
    "add_component": "Add component",
    "meal_name_enter": "Enter meal name",
    "date": "Date",
    "meal_name_null": "Meal name cannot be null"
  },
  "it": {
    "meals": "I tuoi pasti",
    "meal_name_enter": "Inserire nome pasto",
    "add_component": "Aggiungi componente",
    "date": "Data",
    "meal_name_null": "Il nome del pasto non può essere nullo"
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
