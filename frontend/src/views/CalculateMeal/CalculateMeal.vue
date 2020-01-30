<template>
  <div class="containerFather">
    <h3 class="chartTitle">{{ $t('intro') }}</h3>
    <b-tabs>
      <b-tab :title="$t('info')">
        <div class="buttonsDisposition">
          <b-button id="button" class="sim-button button1 buttonCalculate"
            v-on:click='changeGraphGlobal'>
            Global
          </b-button>
          <b-button id="button" class="sim-button button1 buttonCalculate"
            v-on:click='changeGraphComponent'>
            Component
          </b-button>
        </div>
        <div class="container">
          <apexchart class="changeableGraph" type=pie height=450 width=800 :options="chartOptions"
            :series="chart.av" />
        </div>
      </b-tab>
      <b-tab :title="$t('emission')">
        <div class="chart-box">
          <div id="bubble-chart">
            <span class="paddingTop chartTitle">{{$t('co2')}}</span>
            <hr/>
            <apexchart class="co2" type=bubble height=400 :options="chartBubbleCO2Options"
              :series="series">
            </apexchart>
            <hr/>
            <span class="paddingTop chartTitle">{{$t('h2o')}}</span>
            <apexchart class="h2o" type=bubble height=400 :options="chartBubbleWaterOptions"
            :series="series2" />
          </div>
        </div>
      </b-tab>
    </b-tabs>
    <b-modal id="modal-error" title="Error"
      hide-footer v-model="modalErrorShow">
      <div class="d-block text-center">
        <img src="../../assets/restrictionShield.png">
        {{ this.errorMsgModal }}
      </div>
      <b-button class="mt-3" block @click="hideModal">{{ $t('closeBtn')}}</b-button>
    </b-modal>
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
      errorMsgModal: '',
      modalErrorShow: false,
      toLogin: false,
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
        dataLabels: {
          enabled: false,
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
          title: { text: this.$i18n.t('CO2grams') },
        },
        yaxis: {
          max: 600,
          title: { text: this.$i18n.t('gCons') },
          labels: {
            showDuplicates: false,
          },
        },
      };
    },
    chartBubbleWaterOptions() {
      return {
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 0.8,
        },
        title: {
          text: 'Water Footprint',
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
          title: { text: this.$i18n.t('watergrams') },
        },
        yaxis: {
          max: 600,
          labels: {
            showDuplicates: false,
          },
          title: { text: this.$i18n.t('gCons') },
        },
      };
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };
    this.toLogin = false;
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

        Object.keys(response.data.meals[0]).forEach((k, i) => {
          if (i > 2 && i < 13) {
            this.componentsMeal.al.push(k);
          }
        });

        Object.values(response.data.meals[0]).forEach((v, i) => {
          if (i > 2 && i < 13) {
            if (v > 0.0001) {
              this.componentsMeal.av.push(v);
            }
          }
        });
        this.calculate();
      }).catch(error => this.checkError(error.response.data.description,
        error.response.status));
  },
  methods: {
    checkError(error, status) {
      if (error === 'internal_server_error' || error === 'meal_not_found') {
        this.errorMsgModal = error;
        this.$bvModal.show('modal-error');
        this.toLogin = false;
      } else if (status === 401) {
        this.errorMsgModal = this.$i18n.t('unauthorized');
        this.$bvModal.show('modal-error');
        this.toLogin = true;
      } else {
        this.toLogin = false;
        this.errorMsgModal = this.$i18n.t('internal_server_error');
      }
    },
    hideModal() {
      this.$bvModal.hide('modal-error');
      if (this.toLogin) this.$router.push('/login');
      else this.$router.push('/meals');
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
        tmp.push({ name: elem.name, data: [[elem.carbon, elem.qnt, elem.carbon * elem.qnt]] });
      });
      this.series = tmp;

      this.waterFootprint.forEach((elem) => {
        tmp2.push({ name: elem.name, data: [[elem.water, elem.qnt, elem.water * elem.qnt]] });
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
  display: none
</style>
