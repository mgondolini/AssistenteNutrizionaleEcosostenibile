<template>
  <RotatingPieChart class='piechart_meal' :data='chart' />
</template>

<script>
import RotatingPieChart from 'vue-d3-rotating-piechart';

// const axios = require('axios');

export default {
  name: 'chartMealComp',
  components: {
    RotatingPieChart,
  },
  data() {
    return {
      chart: [
        {
          label: 'aaaa',
          value: 100,
        },
        {
          label: 'bbb',
          value: 200,
        },
        {
          label: 'ccc',
          value: 20,
        },
        {
          label: 'ddd',
          value: 15,
        },
        {
          label: 'eee',
          value: 50,
        },
      ],
    };
  },
};

</script>

<style lang="scss">
  @import './ChartMealComp.scss';
</style>
