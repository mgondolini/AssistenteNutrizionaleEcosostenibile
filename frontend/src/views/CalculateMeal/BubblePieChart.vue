
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>
    <div class="chart-box" id="chart-box">
      <zingchart :data="chartData" :series="series"></zingchart>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import zingchartVue from 'zingchart-vue';

Vue.component('zingchart', zingchartVue);


/* eslint-disable no-param-reassign */

/* bubble chart dove ogni bolla è un ingrediente,
quindi il raggio della bolla è dato dalla quantità in grammi dell’ingrediente
(o dalla percentuale di grammi sul totale del pasto.
Ogni bolla è poi un pie chart con la composizione, in termini di componenti,
di quell’ingrediente (es.: 30% grassi, 10% zuccheri).
In pratica ogni bolla è il grafico descritto subito qui sotto.
Per ogni INGREDIENTE del pasto (da mettere in info prodotto)
Pie chart con la composizione in termini di componenti
(es.: il dolce è 30% grassi, 10% zuccheri)
*/


export default {
  name: 'BubblePieChart',
  components: {
    zingchart: zingchartVue,
  },
  data() {
    return {
      chartData: {
        type: 'bubble-pie',
        scaleX: {
          lineColor: 'none',
          guide: {
            lineColor: 'none',
          },
        },
        scaleY: {
          lineColor: 'none',
          guide: {
            lineColor: 'none',
          },
        },
        plot: {
          values: [
            [3, 3, 34],
            [5, 12, 101],
            [4, 3, 34],
            [6, 12, 101],
            [8, 12, 101],
          ],
        },
      },
      series: [
        { 'data-v': [15, 37, 7, 3, 14] },
        { 'data-v': [13, 34, 21, 7, 8] },
        { 'data-v': [6, 30, 31, 5, 8] },
        { 'data-v': [5, 29, null, 3, 13] },
        { 'data-v': [3, 25, 19, 3, null] },
      ],

      //       { 'Tonno all olio di oliva': [811, 811, null] },
      // { 'Mandel Original': [102, 102, 3] },

      ingredients: [],

      // { 'data-v': [15, 37, 7, 3, 14] },
      // { 'data-v': [13, 34, 21, 7, 8] },
      // { 'data-v': [6, 30, 31, 5, 8] },
      // { 'data-v': [5, 29, null, 3, 13] },
      // { 'data-v': [3, 25, 19, 3, null] },
    };
  },
  computed: {

  },
  methods: {
    loadMeal() {
      const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };
      // Array to store pending promises
      const promises = [];
      const { http } = this.$store.state;

      http.get('api/meal', { params })
        .then((response) => {
          [this.meal] = response.data.meals;
          this.meal.components.forEach((c) => {
            // Make a get and store the pending promise returned by axios through loadProductValues
            const promise = this.loadProductValues(c.barcode, c.quantity);
            // Store the pending promise
            promises.push(promise);
          }); // End of the iteration over components

          // Will be triggered when ALL the promises ar fullfilled or rejected
          Promise.all(promises)
            // "responses" is an iterable array of all the promises' responses
            .then((responses) => {
              responses.forEach((res) => {
                this.ingredients.push(res.data);
              });
              // this.createGraphData();
            })
            .catch(err => console.log(err));
        })
        .catch((err) => {
          console.log('Error in fetching api/meals');
          console.log(err);
        });
    },
    loadProductValues(barcode, quantity) {
      const params = {
        barcode,
        quantity,
      };
      return this.$store.state.http.get(`api/product/${params.barcode}/${params.quantity}`, { params });
    },
    createGraphData() {
      this.ingredients.forEach((i) => {
        this.series.push({ [i.product_name]: this.getIngredientComposition(i) });
      });
      console.log(`series${JSON.stringify(this.series)}`);
      console.log(this.series);
    },
    getIngredientComposition(i) {
      return [i.energy_kj_tot, i.energy_kj_tot, i.carbohydrates_tot, i.sugars_tot,
        i.fat_tot, i.saturated_fat_tot, i.proteins_tot, i.salt_tot,
        i.sodium_tot, i.calcium_tot, i.alcohol_tot, i.fiber_tot];
    },
    createGraph() {
      console.log('graphData');
      console.log(this.graphData);
      // const data = [
      //   ['bubble1', [10, 20]],
      //   ['bubble2', [5, 7]],
      //   ['bubble3', [6, 6, 10]],
      //   ['bubble4', [12, 14]],
      //   ['bubble5', [14, 4]],
      //   ['bubble6', [15, 5, 10]],
      //   ['bubble7', [10, 10]],
      //   ['bubble8', [25, 10]],
      //   ['bubble9', [10, 25, 10, 10]],
      //   ['bubble10', [55, 10]],
      //   ['bubble11', [10, 80, 10, 10]],
      //   ['bubble12', [50, 50]],
      // ];

      this.createGraphData();
    },
  },
  mounted() {
    this.loadMeal();
  },
};
</script>

<style>
</style>
