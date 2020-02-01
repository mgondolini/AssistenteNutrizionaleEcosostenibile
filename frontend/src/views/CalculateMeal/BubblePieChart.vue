<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>
    <div class="chart-box">
      <apexchart type=bubble height=400 :options="bubbleChartOptions"
        :series="series">
      </apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'BubblePieChart',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: 'a',
          data: [[100, 200, 300]],
        },
        {
          name: 'b',
          data: [[120, 300, 500]],
        },
        {
          name: 'c',
          data: [[50, 60, 70]],
        },
      ],
    };
  },
  computed: {
    bubbleChartOptions() {
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
          max: 150,

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
          max: 400,
          title: { text: this.$i18n.t('gCons') },
          labels: {
            showDuplicates: false,
          },
        },
      };
    },
  },
  methods: {

  },
  mounted() {

  },
};
</script>

<style>

</style>
