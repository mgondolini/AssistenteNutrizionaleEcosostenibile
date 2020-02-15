
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
import CirclePacker from 'circlepacker';

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
          // values: '0:80:5',
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
            borderColor: 'pink',
            borderWidth: 2,
            lineStyle: 'dashed',
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
              item: {
                fontSize: 6,
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
                borderColor: 'green',
                borderWidth: 2,
                lineStyle: 'normal',
              },
              minSize: 10,
              maxSize: 20,
              scaling: 'radius',
              sizeFactor: 4,
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

      console.log('NEW VALUES');
      console.log(this.chartData.plot.values);
      console.log('NEW SERIES');
      this.series = this.populateSeries();
      console.log(this.series);

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
      let obj;
      const firstObject = {
        dataV: values,
        dataPie: name,
        valueBox: {
          text: '%data-bubble',
          placement: 'top',
          fontColor: 'black',
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontSize: '12',
        },
      };

      if (name === 'Carbohydrates') obj = firstObject;
      else {
        obj = {
          dataV: values,
          dataPie: name,
        };
      }

      return obj;
    },
    createCirclePacker() {
      const circles = [];

      let i = 0;
      this.ingredients.forEach(() => {
        const v = this.values[i];
        circles.push(this.createCircle(v.x, v.y, v.radius));
        i += 1;
      });

      console.log(circles);

      // const rect = containerEl.getBoundingClientRect(); //container è il grafico
      // const bounds = { width: rect.width, height: rect.height }; // grandezza grafico
      // const target = { x: bounds.width / 2, y: bounds.height / 2 };

      const packer = new CirclePacker({
        // bounds,
        // target,
        circles,
        // onMove: render,
        continuousMode: false,
        collisionPasses: 5,
        centeringPasses: 200,
      });

      console.log(packer);
    },
    createCircle(x, y, radius) {
      radius = radius || CirclePacker.random(10, 40);
      x = x || CirclePacker.random(radius, 500 - radius);
      y = y || CirclePacker.random(radius, 500 - radius);

      const diameter = radius * 2;
      const circleEl = document.createElement('div');

      // need some sort of unique id...
      const id = `circle-${CirclePacker.random(0, 1000, true)}-${Date.now()}`;

      const circle = {
        id,
        radius,
        position: {
          x: CirclePacker.random(radius, 500 - radius),
          y: CirclePacker.random(radius, 500 - radius),
        },
      };

      // create circle el

      circleEl.id = id;
      circleEl.style.width = `${diameter}px`;
      circleEl.style.height = `${diameter}px`;
      circleEl.style.borderRadius = `${diameter}px`;
      circleEl.classList.add('circle');

      // containerEl.appendChild(circleEl);

      // circleEls[id] = circleEl;

      return circle;
    },
  },
  created() {
    this.loadMeal();
  },
  mounted() {
    // this.loadMeal();
    this.zingchart.loadModules('bubblepie', () => { // Load Modules Method
      this.zingchart.render({ // Render Method
        id: 'myChart1',
        data: this.chartData(),
        height: 400,
        width: 600,
      });
    });
  },
};
</script>

<style>
</style>
