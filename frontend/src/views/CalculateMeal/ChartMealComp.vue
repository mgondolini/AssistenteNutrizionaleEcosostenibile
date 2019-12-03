<template>
  <RotatingPieChart class='piechart_meal' :data='component' />
</template>

<script>
import RotatingPieChart from 'vue-d3-rotating-piechart';

export default {
  name: 'chartMealComp',
  components: {
    RotatingPieChart,
  },
  props: {
    component: Object,
  },
  /* mounted() {
    const usr = 'mrossi';
    const param = { username: usr };

    this.$http.get(`http://localhost:8081/api/${param.username}/meals`, { params: param })
      .then((response) => {
        const tmp = [];
        response.data.meals[0].components.forEach((elem) => {
          tmp.push({ label: elem.product_name, value: elem.quantity });
          // console.log(elem);
          console.log({ label: elem.product_name, value: elem.quantity });
        });
        this.chart = tmp;
        this.$nextTick();
        console.log('chart :'.concat(this.chart[0].label));
      })
      .catch(error => (console.log(error)));
  }, */
};

</script>

<style lang="scss">
  @import './ChartMealComp.scss';
</style>
