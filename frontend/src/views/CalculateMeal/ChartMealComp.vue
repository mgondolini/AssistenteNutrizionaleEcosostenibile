<template>
  <div>
    <apexchart type=pie width=800 :options="chartOptions" :series="series" />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'chartMealComp',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    mealComp: {
      type: Object,
    },
  },
  data() {
    return {
      series: this.mealComp.av,
      chartOptions: {
        labels: this.mealComp.al,
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
      },
    };
  },
};

</script>
