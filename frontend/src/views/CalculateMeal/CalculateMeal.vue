<template>
  <div class="container">
    <h3>Composizione del tuo pasto</h3>
    <ChartMealComp class="piechart_meal" v-bind:mealComp="chart" />
    <hr>
    <!-- <h3>OMS Tabelle</h3>
    <Apex :mealComp="chart" />-->
  </div>
</template>

<script>
import ChartMealComp from './ChartMealComp.vue';
// import Apex from './Apex-chart.vue';

export default {
  name: 'calculateMealComposition',
  components: {
    ChartMealComp,
    // Apex,
  },
  data() {
    return {
      chart: { al: [], av: [] },
    };
  },
  mounted() {
    const usr = 'mrossi';
    const param = { username: usr };

    this.$http.get(`http://localhost:8081/api/${param.username}/meals`, { params: param })
      .then((response) => {
        response.data.meals[0].components.forEach((elem) => {
          this.chart.al.push(elem.product_name.concat(' - ').concat(elem.quantity).concat(' g'));
          this.chart.av.push(elem.quantity);
        });
      })
      .catch(error => (console.log(error)));
  },
};
</script>

<style lang="scss">
  @import './ChartMealComp.scss';
</style>
