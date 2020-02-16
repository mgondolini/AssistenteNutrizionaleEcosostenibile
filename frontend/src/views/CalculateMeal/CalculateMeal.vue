<template>
  <div class="containerFather">
    <h3 class="chartTitle">{{ $t('intro') }}</h3>
    <div class="containerGraphs">
      <b-tabs class="tabsContainer" id="myTabContent">
        <b-tab class="tab-content-info" :title="$t('info')" active>
          <div class="buttonsDisposition">
            <b-button id="button" class="sim-button button1 buttonCalculate"
              v-on:click='changeGraphGlobal'>
              {{ this.$i18n.t('global') }}
            </b-button>
            <b-button id="button" class="sim-button button1 buttonCalculate"
              v-on:click='changeGraphComponent'>
               {{ this.$i18n.t('component') }}
            </b-button>
          </div>
          <div class="container">
            <apexchart class="changeableGraph" type=pie height=450 :options="chartOptions"
              :series="chart.av" />
          </div>
        </b-tab>
        <b-tab class="tab-content-info" :title="$t('emission')">
          <div class="chart-box">
            <div id="bubble-chart">
              <h5 class="paddingTop chartTitleCC">{{$t('co2')}}</h5>
              <hr/>
              <apexchart class="co2" type=bubble height=400 :options="chartBubbleCO2Options"
                :series="series">
              </apexchart>
              <hr/>
              <h5 class="paddingTop chartTitleCC">{{$t('h2o')}}</h5>
              <apexchart class="h2o" type=bubble height=400 :options="chartBubbleWaterOptions"
              :series="series2" />
            </div>
          </div>
        </b-tab>
        <b-tab class="tab-content-info" :title="$t('ingredients')">
          <div class="chart-box">
            <zingchart ref="bubblepie" :data="bubbleChartData" :series="bubbleSeries"></zingchart>
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import zingchartVue from 'zingchart-vue';

// TODO: trovare un modo di importarlo migliore
// eslint-disable-next-line import/extensions
import '../../../node_modules/zingchart/modules/zingchart-bubblepie.min.js';


export default {
  name: 'CalculateMeal',
  data() {
    return {
      chart: { al: [], av: [] },
      componentsMeal: { al: [], av: [] },
      composition: { al: [], av: [] },
      arr: [],
      waterFootprint: [],
      series: [{
        name: '',
        data: [],
      }],
      series2: [{
        name: '',
        data: [],
      }],

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

      // Bubble dimension
      radius: [],

      // Labels
      bubbleLabels: [],

      // Series
      bubbleSeries: [],

    };
  },
  computed: {
    chartOptions() {
      return {
        labels: this.chart.al,
        dataLabels: {
          formatter(val, opts) {
            return `${opts.w.config.series[opts.seriesIndex].toFixed(2)} g`;
          },
        },
        colors: ['#F3B415', '#F27036', '#663F59', '#6A6E94', '#4E88B4', '#00A7C6', '#18D8D8',
          '#A9D794', '#46AF78', '#A93F55', '#8C5E58', '#2176FF', '#33A1FD', '#7A918D', '#BAFF29',
        ],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 350,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
      };
    },
    chartBubbleCO2Options() {
      return {
        height: 500,
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 0.8,
        },
        title: {
          text: this.$i18n.t('carbonFootprint'),
        },
        xaxis: {
          tickAmount: 10,
          min: 0.1,
          max: 50,

          labels: {
            rotate: -45,
            rotateAlways: true,
          },
          axisBorder: {
            show: true,
            color: 'red',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'blue',
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
          title: { text: this.$i18n.t('CO2grams') },
        },
        yaxis: {
          min: 0,
          max: 300,
          title: { text: this.$i18n.t('gCons') },
          labels: {
            showDuplicates: false,
          },
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 2,
            maxBubbleRadius: 50,
          },
        },
      };
    },
    chartBubbleWaterOptions() {
      return {
        height: 500,
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 0.8,
        },
        title: {
          text: this.$i18n.t('waterFootprint'),
        },
        xaxis: {
          tickAmount: 10,
          min: 0.1,
          max: 50,
          labels: {
            rotate: -45,
            rotateAlways: true,
          },
          axisBorder: {
            show: true,
            color: 'red',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'blue',
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
          title: { text: this.$i18n.t('watergrams') },
        },
        yaxis: {
          max: 300,
          labels: {
            showDuplicates: false,
          },
          title: { text: this.$i18n.t('gCons') },
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 2,
            maxBubbleRadius: 50,
          },
        },
      };
    },
    bubbleChartData() {
      return {
        type: 'bubble-pie',
        height: '100%',
        width: '80%',
        x: '0%',
        y: '0%',
        scaleX: {
          minValue: 0,
          maxValue: 50,
          label: {
            text: 'CO2 footprint',
          },
          step: 5,
          // lineColor: 'none',
          guide: {
            lineColor: 'none',
          },
        },
        scaleY: {
          minValue: 0,
          maxValue: 50,
          step: 5,
          // lineColor: 'none',
          label: {
            text: 'Water footprint',
          },
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
  components: {
    apexchart: VueApexCharts,
    zingchart: zingchartVue,
  },
  mounted() {
    const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };
    const promises = [];
    this.$store.state.http.get('api/meal', { params })
      .then((response) => {
        response.data.meals[0].components.forEach((elem) => {
          this.composition.al.push(elem.product_name.concat(' - ').concat(elem.quantity).concat(' g'));
          this.composition.av.push(elem.quantity);
          this.arr.push({
            name: elem.product_name,
            qnt: elem.quantity,
            carbon: elem.carbon_footprint,
          });

          this.waterFootprint.push({
            name: elem.product_name,
            qnt: elem.quantity,
            water: elem.water_footprint,
          });
        });
        this.chart.al = this.composition.al;
        this.chart.av = this.composition.av;

        const m = response.data.meals[0];
        Object.keys(m).forEach((k, i) => {
          if (i > 2 && i < 13) {
            if (m[k] > 0.0001) {
              this.componentsMeal.al.push(this.$i18n.t(k));
              this.componentsMeal.av.push(parseFloat(m[k].toFixed(2)));
            }
          }
        });

        this.calculate();

        [this.meal] = response.data.meals;
        this.meal.components.forEach((c) => {
          const promise = this.loadProductValues(c.barcode, c.quantity);
          this.radius.push(c.quantity);
          promises.push(promise);
        });

        Promise.all(promises)
          .then((responses) => {
            responses.forEach((res) => {
              this.ingredients.push(res.data);
            });
            this.createGraphData();
          })
          .catch(err => console.log(err));
      }).catch(error => this.checkError(error.response.data.description,
        error.response.status));
  },
  methods: {
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

      this.values = [];
      this.dataBubble = [];
      this.bubbleSeries = null;

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

        this.values.push([x, y, this.radius[j]]);
        this.bubbleLabels.push(i.product_name);

        j += 1;
      });

      this.bubbleSeries = this.populateSeries();
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
    checkError(error, status) {
      if (error === 'internal_server_error') {
        this.$root.$emit('openModalError', 'internal_server_errorTitle', 'internal_server_error',
          () => this.$router.push('/meals'));
      } else if (error === 'meal_not_found') {
        this.$root.$emit('openModalError', 'meal_not_foundTitle', 'meal_not_found',
          () => this.$router.push('/meals'));
      } else if (status === 401) {
        this.$root.$emit('openModalError', 'unauthorizedTitle', 'unauthorized',
          () => this.$router.push('/login'));
      } else if (error === undefined) {
        this.$root.$emit('openModalError', 'noAnswerTitle', 'noAnswer',
          () => this.$router.push('/meals'));
      } else {
        this.$root.$emit('openModalError', 'internal_server_errorTitle', 'internal_server_error',
          () => this.$router.push('/meals'));
      }
    },
    changeGraphGlobal() {
      this.chart.al = this.composition.al;
      this.chart.av = this.composition.av;
    },
    changeGraphComponent() {
      this.chart.al = this.componentsMeal.al;
      this.chart.av = this.componentsMeal.av;
    },
    calculate() {
      const tmp = [];
      const tmp2 = [];
      this.arr.forEach((elem) => {
        const area = Math.round(elem.carbon * elem.qnt);
        tmp.push({ name: elem.name, data: [[elem.carbon, elem.qnt, area]] });
      });
      this.series = tmp;
      this.waterFootprint.forEach((elem) => {
        const area = Math.round(elem.water * elem.qnt);
        tmp2.push({ name: elem.name, data: [[elem.water, elem.qnt, area]] });
      });
      this.series2 = tmp2;
    },
  },
};
</script>


<i18n src='./text.json'>
</i18n>

<style lang="sass">
@import './calculateMeal.sass'
@import './bubbleChartEmissions.sass'
.apexcharts-toolbar
  display: none !important
</style>
