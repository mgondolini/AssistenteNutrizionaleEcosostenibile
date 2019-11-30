<template>
  <div class="container">
    <h3>Composizione del tuo pasto</h3>
    <ChartMealComp/>
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
};
</script>
