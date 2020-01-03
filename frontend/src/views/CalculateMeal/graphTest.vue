<template>
  <apexchart type=pie height=450 width=800 :options="chartOptions"
        :series="chart.av" />
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'CalculateMeal',
  data() {
    return {
      chart: { al: [], av: [] },
      componentsMeal: { al: [], av: [] },
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
        Object.keys(response.data.meals[0]).forEach((k, i) => {
          if (i > 2 && i < 13) {
            this.componentsMeal.al.push(k);
          }
        });

        Object.values(response.data.meals[0]).forEach((v, i) => {
          if (i > 2 && i < 13) {
            if (v > 0.0001) this.componentsMeal.av.push(v);
          }
        });

        this.chart.al = this.componentsMeal.al;
        this.chart.av = this.componentsMeal.av;
      }).catch(error => (console.log(error)));
  },
};
</script>

<style lang="sass">
  @import './calculateMeal'
</style>
