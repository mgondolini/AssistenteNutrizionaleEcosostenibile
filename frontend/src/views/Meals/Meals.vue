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
              <b-button
                    pill
                    variant="link"
                    class="p-0"
                    @click="addComponent"
                  >
                    <img class="add" src="../../assets/buttons/plus.svg">
                    Add component
              </b-button>
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
                    <b-button
                      pill
                      variant="link"
                      class="p-0"
                      @click="removeComponent(component.barcode, meal.meal_name)"
                    >
                      <img class="remove" src="../../assets/buttons/remove.svg">
                    </b-button>
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
    addComponent() {
      this.$router.push('/info_prod');
      // come passare mealname??
    },
    removeComponent(barcode, mealName) {
      const usr = 'mrossi';
      const param = {
        username: usr,
        barcode,
        mealName,
      };
      console.log(param); // DEBUG
      this.$http.delete(`api/${param.username}/meals/${param.mealName}/components`, { params: param })
        .then((response) => {
          this.mealsList = [];
          this.mealsList.push(response.data.meals);
          console.log(this.mealsList);
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
    "quantity": "Quantity"
  },
  "it": {
    "last_meals": "I tuoi ultimi pasti",
    "quantity": "Quantità"
  }
}
</i18n>

<style lang="sass">
  @import './meals.sass'
</style>
