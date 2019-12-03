<template>
  <div class="container">
    <h3>Composizione del tuo pasto</h3>
    <ChartMealComp component=chart />
    <h3>OMS Tabelle</h3>
    <Apex />
  </div>
</template>

<script>
import ChartMealComp from './ChartMealComp.vue';
import Apex from './Apex-chart.vue';

export default {
  name: 'calculateMealComposition',
  components: {
    ChartMealComp,
    Apex,
  },
  data: function f() {
    return {
      chart: [],
    };
  },
  mounted() {
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
  },
};
</script>
