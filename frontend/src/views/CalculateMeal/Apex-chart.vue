<template>
   <div class='barchart' >
     <apexcharts width="500" type="bar" :options="chartOptions"
     :series="series"></apexcharts>
   </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import Vue from 'vue';

Vue.use(VueApexCharts);

export default {
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      }],
    };
  },
};
</script>

<style lang="scss">
  .barchart{
    display: flex;
    justify-content: center;
    .apexcharts-toolbar{
      display: none !important;
    }
  }
</style>
