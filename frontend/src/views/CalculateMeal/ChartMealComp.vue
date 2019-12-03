<template>
  <RotatingPieChart class='piechart_meal' v-bind:data='dataToShow' />
</template>

<script>
import RotatingPieChart from 'vue-d3-rotating-piechart';

export default {
  name: 'chartMealComp',
  components: {
    RotatingPieChart,
  },
  props: {
    mealComp: Array,
  },
  data() {
    return {
      dataToShow: this.mealComp,
    };
  },
  mounted() {
    this.dataToShow = this.mealComp;
    console.log('array: '.concat(this.dataToShow));
  },
};

</script>

<style lang="scss">
  @import './ChartMealComp.scss';
</style>
