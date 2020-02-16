
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>

    <div v-if="ready" class="chart-box" id="chart-box">
      <zingchart ref="bubblepie" :data="chartData" :series="series"></zingchart>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import zingchartVue from 'zingchart-vue';

// TODO: trovare un modo di importarlo migliore
// eslint-disable-next-line import/extensions
import '../../../node_modules/zingchart/modules/zingchart-bubblepie.min.js';

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

      // Coordinates and radius of the bubbles
      values: [],

      // Flag
      ready: false,

      // Bubble dimension
      radius: [],

      // Labels
      bubbleLabels: [],

      // Series
      series: [],

    };
  },
  computed: {
    chartData() {
      return {
        type: 'bubble-pie',
        height: '100%',
        width: '80%',
        x: '0%',
        y: '0%',
        scaleX: {
          minValue: 0,
          maxValue: 50,
          step: 5,
          lineColor: 'none',
          guide: {
            lineColor: 'none',
          },
        },
        scaleY: {
          minValue: 0,
          maxValue: 50,
          step: 1,
          lineColor: 'none',
          guide: {
            lineColor: 'none',
          },
        },
        legend: {
          item: {
            text: '%data-pie',
            fontSize: 12,
          },
          width: '10%',
          align: 'right',
          verticalAlign: 'middle',
        },
        plot: {
          values: this.values,
          dataBubble: this.bubbleLabels,
          tooltip: {
            text: '%data-pie: %data-v',
            fontColor: 'blue',
            fontFamily: 'Georgia, serif',
            backgroundColor: 'white',
            borderColor: 'blue',
            borderWidth: 2,
          },
          minSize: 30,
          maxSize: 50,
          scaling: 'radius',
          sizeFactor: 5,
        },
        mediaRules: [
          {
            maxWidth: 500,
            width: '100%',
            legend: {
              align: 'right',
              verticalAlign: 'top',
              layout: '5x2',
              width: '60%',
              item: {
                fontSize: 10,
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
                borderColor: 'blue',
                borderWidth: 2,
                lineStyle: 'normal',
              },
              minSize: 10,
              maxSize: 20,
              scaling: 'radius',
              sizeFactor: 5,
            },
          },
          {
            maxWidth: 300,
            label: {
              visible: false,
            },
          },
        ],
      };
    },
  },
  methods: {
    loadMeal() {
      const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };


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
      let x;
      let y;

      let j = 0;

      console.log('Radius');
      console.log(this.radius);

      console.log('OLD VALUES');
      console.log(this.chartData.plot.values);
      console.log('OLD SERIES');
      console.log(this.series);


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

        x = i.carbon_footprint_tot;
        y = i.water_footprint_tot;

        console.log(`coords (${x}, ${y})`);

        this.values.push([x, y, this.radius[j]]);
        this.bubbleLabels.push(i.product_name);

        j += 1;
      });
      console.log('bubble labels');
      console.log(this.bubbleLabels);
      console.log('NEW VALUES');
      console.log(this.chartData.plot.values);
      console.log('NEW SERIES');
      this.series = this.populateSeries();
      console.log(this.series);

      this.ready = true;
    },
    populateSeries() {
      return [
        this.createObject('carbohydrates', this.carbohydrates),
        this.createObject('sugars', this.sugars),
        this.createObject('total_fats', this.fats),
        this.createObject('saturated_fats', this.saturatedFats),
        this.createObject('proteins', this.proteins),
        this.createObject('salt', this.salt),
        this.createObject('sodium', this.sodium),
        this.createObject('calcium', this.calcium),
        this.createObject('alcohol', this.alcohol),
        this.createObject('fibers', this.fibers),
      ];
    },
    createObject(name, values) {
      let obj;
      const firstObject = {
        dataV: values,
        dataPie: this.$i18n.t(name),
        valueBox: {
          text: '%data-bubble',
          placement: 'bottom',
          fontColor: 'black',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontSize: '10',
        },
      };

      if (name === 'carbohydrates') obj = firstObject;
      else {
        obj = {
          dataV: values,
          dataPie: this.$i18n.t(name),
        };
      }

      return obj;
    },
  },
  created() {
    this.loadMeal();
  },
  mounted() {
  },
};
</script>


<i18n>
{
  "en": {
    "carbohydrates": "Carbohydrates",
    "proteins": "Proteins",
    "fibers": "Fibers",
    "total_fats": "Fats",
    "saturated_fats": "Saturated fats",
    "calcium": "Calcium",
    "sodium": "Sodium",
    "salt": "Salt",
    "alcohol": "Alcohol",
    "sugars": "Sugars"
  },
  "it": {
    "carbohydrates": "Carboidrati",
    "proteins": "Proteine",
    "fibers": "Fibre",
    "total_fats": "Grassi",
    "saturated_fats": "Grassi saturi",
    "calcium": "Calcio",
    "sodium": "Sodio",
    "salt": "Sale",
    "alcohol": "Alcool",
    "sugars": "Zuccheri"
  }
}
</i18n>


<style>
</style>
