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
      <apexchart class="changeableGraph" type=pie width=800 :options="chartOptions"
        :series="chart.av" />
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
              width: 350,
            },
            legend: {
              position: 'bottom',
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
            this.componentsMeal.av.push(v);
          }
        });
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
</style>
