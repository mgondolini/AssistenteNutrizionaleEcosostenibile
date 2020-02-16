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
      </b-tabs>
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
      series: [{
        name: '',
        data: [],
      }],
      series2: [{
        name: '',
        data: [],
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
  },
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };
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
      }).catch(error => this.checkError(error.response.data.description,
        error.response.status));
  },
  methods: {
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
