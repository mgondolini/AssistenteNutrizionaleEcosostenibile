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
          type: 'bubble',
          data: [[50, 200, 100]],
        },
        {
          name: 'b',
          type: 'pie',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
        },
      ],
      pieSeries: [44, 55, 13, 43, 22],
    };
  },
  computed: {
    bubbleChartOptions() {
      return {
        chart: {
          height: 350,
          type: 'bubble',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: 'Carbon Footprint',
        },
        xaxis: {
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
          max: 400,
          title: { text: 'testo' },
          labels: {
            showDuplicates: false,
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
      };
    },
    pieOptions() {
      return {
        chart: {
          width: 1,
          type: 'pie',
        },
        grid: {
          show: true,
          borderColor: '#90A4AE',
          strokeDashArray: 0,
          position: 'back',
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
          row: {
            colors: undefined,
            opacity: 0.5,
          },
          column: {
            colors: undefined,
            opacity: 0.5,
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        responsive: [{
          breakpoint: 100,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
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
