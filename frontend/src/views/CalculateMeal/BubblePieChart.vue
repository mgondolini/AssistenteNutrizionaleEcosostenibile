
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>

    <div v-if="ready" class="chart-box" id="chart-box">
      <zingchart ref="bubblepie" :data="chartData" :series="series"></zingchart>
    </div>
  </div>
</template>

    <!-- Bubble pie chart-->
<script src="https://cdn.zingchart.com/zingchart.min.js"></script>

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
      // Nutritional values
      ingredients: [],
      carbohydrates: [],
      sugars: [],
      fats: [],
      saturatedFats: [],
      proteins: [],
      salt: [],
      sodium: [],
      calcium: [],
      alcohol: [],
      fibers: [],
      values: [],

      ready: false,

      // Bubble dimension
      radius: [],

      // Labels
      bubbleLabels: [],

      // Chart

      series: [],
      // [ // (2) Provide your pie chart data.
      //   { 'data-v': [null, null, null, null, null] }, // slice1
      //   // { 'data-v': [13, 34, 21, 7, 8] }, // slice2
      //   // { 'data-v': [6, 30, 31, 5, 8] }, // slice3
      //   // { 'data-v': [5, 29, null, 3, 13] }, // slice4
      //   // { 'data-v': [3, 25, 19, 3, null] }, // slice5
      // ],
    };
  },
  computed: {
    chartData() {
      return {
        type: 'bubble-pie',
        height: '100%',
        width: '100%',
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
        legend: {
          item: {
            text: '%data-pie',
          },
        },
        plot: {
          values: this.values,
          dataBubble: this.bubbleLabels,
          tooltip: {
            text: '%data-pie: %data-v',
            fontColor: 'blue',
            fontFamily: 'Georgia, serif',
            backgroundColor: 'white',
            borderColor: 'pink',
            borderWidth: 2,
            lineStyle: 'dashed',
          },
          minSize: 30,
          maxSize: 50,
          // scaling: 'radius',
          sizeFactor: 5,
        },
      };
    },
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
            this.radius.push(c.quantity);
            // Store the pending promise
            promises.push(promise);
          }); // End of the iteration over components

          // Will be triggered when ALL the promises ar fullfilled or rejected
          Promise.all(promises)
            .then((responses) => {
              responses.forEach((res) => {
                this.ingredients.push(res.data);
              });
              this.createGraphData();
            })
            .catch(err => console.log(err));
        })
        .catch((err) => {
          console.log('Error in fetching api/meals');
          console.log(err);
        });
    },
    loadProductValues(barcode, quantity) {
      const { http } = this.$store.state;
      const params = {
        barcode,
        quantity,
      };

      return http.get(`api/product/${params.barcode}/${params.quantity}`, { params });
    },
    createGraphData() {
      let x = 20;
      let y = 20;

      let j = 0;

      console.log("Radius");
      console.log(this.radius);

      console.log('OLD VALUES');
      console.log(this.chartData.plot.values);
      console.log('OLD SERIES');
      console.log(this.series);
      // alert('REPLACING STUBS WITH REAL VALUES IN GRAPH');
      this.values = [];
      this.dataBubble = [];
      this.series = null;

      this.ingredients.forEach((i) => {
        this.carbohydrates.push(Number((i.carbohydrates_tot).toFixed(2)));
        this.sugars.push(Number((i.sugars_tot).toFixed(2)));
        this.fats.push(Number((i.fat_tot).toFixed(2)));
        this.saturatedFats.push(Number((i.saturated_fat_tot).toFixed(2)));
        this.proteins.push(Number((i.proteins_tot).toFixed(2)));
        this.salt.push(Number((i.salt_tot).toFixed(2)));
        this.sodium.push(Number((i.sodium_tot).toFixed(2)));
        this.calcium.push(Number((i.calcium_tot).toFixed(2)));
        this.alcohol.push(Number((i.alcohol_tot).toFixed(2)));
        this.fibers.push(Number((i.fiber_tot).toFixed(2)));

        this.values.push([x, y, this.radius[j]]);
        this.bubbleLabels.push(i.product_name);

        x += 10;
        y += 10;
        j += 1;
      });


      console.log('NEW VALUES');
      console.log(this.chartData.plot.values);
      console.log('NEW SERIES');
      this.series = this.populateSeries();
      console.log(this.series);

      /*
      this.$refs.bubblepie.modifyplot({
        graphid: 0,
        plotindex: 1,
        data: { chartData: { plot: { values: this.values } } },
      });
      */
      /*
      this.$refs.bubblepie.setdata({
        data: { plot: { values: this.values } },
      });
      this.$refs.bubblepie.reload();
      console.log(this.$refs.bubblepie.chartData.plot);

      this.series = this.populateSeries();
      */
      // this.$refs.bubblepie.update();

      this.ready = true;
    },
    populateSeries() {
      return [
        this.createObject('Carbohydrates', this.carbohydrates),
        this.createObject('Sugars', this.sugars),
        this.createObject('Fats', this.fats),
        this.createObject('SaturatedFats', this.saturatedFats),
        this.createObject('Proteins', this.proteins),
        this.createObject('Salt', this.salt),
        this.createObject('Sodium', this.sodium),
        this.createObject('Calcium', this.calcium),
        this.createObject('Alcohol', this.alcohol),
        this.createObject('Fibers', this.fibers),
      ];
    },
    createObject(name, values) {
      return {
        'data-v': values,
        'data-pie': name,
      };
    },
  },
  created() {
    this.loadMeal();
  },
  mounted() {
    // this.loadMeal();
  },
};
</script>

<style>
</style>
