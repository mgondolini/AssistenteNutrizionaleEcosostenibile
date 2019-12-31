<template>
  <div class="containerFather">
    <h3>{{ $t('intro') }}</h3>
    <div class="buttonsDisposition">
      <div id="button" class="sim-button button1 buttonCalculate" v-on:click='changeGraphGlobal'>
        <span>Global</span>
      </div>
      <div id="button" class="sim-button button1 buttonCalculate"
        v-on:click='changeGraphComponent'>
        <span>Component</span>
      </div>
    </div>
    <div class="container">
      <apexchart class="changeableGraph" type=pie height=450 width=800 :options="chartOptions"
        :series="chart.av" />
    </div>
    <div class="emissionsGraphs">
      <apexchart type=bubble height=350 width=600 :options="chartBubbleCO2Options"
      :series="series" />
      <apexchart type=bubble height=350 width=600 :options="chartBubbleWaterOptions"
      :series="series2" />
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'CalculateMeal',
  data() {
    return {
      chart: { al: [], av: [] },
      componentsMeal: { al: [], av: [] },
      composition: { al: [], av: [] },
      arr: [],
      waterFootprint: [],
      carbonFootprint: [],
      series: [{
        name: '',
        data: [],
      }],
      series2: [{
        name: 'Bubble2',
        data: [[10, 20, 30], [18, 60, 80]],
      },
      {
        name: 'Bubbles',
        data: [[10, 40, 30], [18, 80, 80]],
      }],
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
              width: 350,
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
        dataLabels: {
          enabled: true,
        },
        fill: {
          opacity: 0.8,
        },
        title: {
          text: 'Carbon Footprint',
        },
        xaxis: {
          tickAmount: 10,
          min: 0,
          max: 50,

          labels: {
            showDuplicates: false,
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
          title: { text: 'CO2 per grammo' },
        },
        yaxis: {
          max: 600,
          title: { text: 'grammi consumati' },
          labels: {
            showDuplicates: false,
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 350,
            },
          },
        }],
      };
    },
    chartBubbleWaterOptions() {
      return {
        dataLabels: {
          enabled: true,
        },
        fill: {
          opacity: 0.8,
        },
        title: {
          text: 'Water Footprint',
        },
        xaxis: {
          tickAmount: 30,
          min: 0,
          max: 30,
          labels: {
            showDuplicates: false,
            rotate: -45,
            rotateAlways: true,
          },
          type: 'category',
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
        },
        yaxis: {
          max: 200,
          labels: {
            showDuplicates: false,
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 350,
            },
          },
        }],
      };
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    const usr = 'mrossi';
    const mealName = 'Cena';
    const param = { username: usr, mealName };
    this.$store.state.http.get(`api/${param.username}/meals/${param.mealName}`, { params: param })
      .then((response) => {
        response.data.meals[0].components.forEach((elem) => {
          this.composition.al.push(elem.product_name.concat(' - ').concat(elem.quantity).concat(' g'));
          this.composition.av.push(elem.quantity);
          this.arr.push({
            name: elem.product_name,
            qnt: elem.quantity,
            carbon: elem.carbon_footprint,
          });
        });
        this.chart.al = this.composition.al;
        this.chart.av = this.composition.av;

        Object.keys(response.data.meals[0]).forEach((k, i) => {
          if (i > 2 && i < 13) {
            this.componentsMeal.al.push(k);
          }
        });

        Object.values(response.data.meals[0]).forEach((v, i) => {
          if (i > 2 && i < 13) {
            if (v > 0) this.componentsMeal.av.push(v);
          }
        });
        this.calculate();
      }).catch(error => (console.log(error)));
  },
  methods: {
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
      this.arr.forEach((elem) => {
        tmp.push({ name: elem.name, data: [[elem.carbon, elem.qnt, elem.carbon * elem.qnt]] });
      });
      this.series = tmp;
    },
  },
};
</script>


<i18n>
{
  "en": {
    "intro": "Composition of your meal"
  },
  "it": {
    "intro": "Coposizione del tuo pasto"
  }
}
</i18n>

<style lang="sass">
  @import './calculateMeal'
  @import 'bubbleChrartEmissions'
  .apexcharts-toolbar
    display: none
</style>
