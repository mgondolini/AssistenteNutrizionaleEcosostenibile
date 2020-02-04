
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>
    <div class="chart-box" id="chart-box">
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import * as d3 from 'd3';

console.log(d3);
/* eslint-disable no-param-reassign */

/* bubble chart dove ogni bolla è un ingrediente,
quindi il raggio della bolla è dato dalla quantità in grammi dell’ingrediente
(o dalla percentuale di grammi sul totale del pasto.
Ogni bolla è poi un pie chart con la composizione, in termini di componenti,
di quell’ingrediente (es.: 30% grassi, 10% zuccheri).
In pratica ogni bolla è il grafico descritto subito qui sotto.
Per ogni INGREDIENTE del pasto (da mettere in info prodotto)
Pie chart con la composizione in termini di componenti
(es.: il dolce è 30% grassi, 10% zuccheri)
*/


export default {
  name: 'BubblePieChart',
  components: {

  },
  data() {
    return {
      graphData: [],
      diameter: 0,
      meal: { },
      ingredients: [],
      promises: [],
    };
  },
  computed: {

  },
  methods: {
    loadMeal() {
      const params = { mealName: this.$route.query.mealName, date: this.$route.query.date };
      // Array to store pending promises
      const promises = [];
      const { http } = this.$store.state;

      http.get('api/meal', { params })
        .then((response) => {
          [this.meal] = response.data.meals;
          this.meal.components.forEach((c) => {
            // Make a get and store the pending promise returned by axios through loadProductValues
            const promise = this.loadProductValues(c.barcode, c.quantity);
            // Store the pending promise
            promises.push(promise);
          }); // End of the iteration over components

          // Will be triggered when ALL the promises ar fullfilled or rejected
          Axios.all(promises)
          // Spread( ()=>{} ) will execute the callback {} on a varargs
          // with args[i].data containing the response of one particular request
            .then(Axios.spread((...args) => {
              for (let i = 0; i < args.length; i += 1) {
                this.ingredients.push(args[i].data);
              }
            }))
          // The execution is chained immediately after the completion of the for, not before
            .then(() => {
              this.createGraphData();
            })
            .catch(() => { console.log('ERROR IN SPREAD'); });
        })
        .catch(() => { console.log('ERROR IN ALL'); });
    },
    loadProductValues(barcode, quantity) {
      const params = {
        barcode,
        quantity,
      };
      return this.$store.state.http.get(`api/product/${params.barcode}/${params.quantity}`, { params });
    },
    createGraphData() {
      this.ingredients.forEach((i) => {
        this.graphData.push([i.product_name, this.getIngredientComposition(i)]);
      });
      console.log('graphData');
      console.log(this.graphData);
    },
    getIngredientComposition(i) {
      return [i.energy_kj_tot, i.energy_kj_tot, i.carbohydrates_tot, i.sugars_tot,
        i.fat_tot, i.saturated_fat_tot, i.proteins_tot, i.salt_tot,
        i.sodium_tot, i.calcium_tot, i.alcohol_tot, i.fiber_tot];
    },
    createGraph() {
      console.log('graphData');
      console.log(this.graphData);
      // const data = [
      //   ['bubble1', [10, 20]],
      //   ['bubble2', [5, 7]],
      //   ['bubble3', [6, 6, 10]],
      //   ['bubble4', [12, 14]],
      //   ['bubble5', [14, 4]],
      //   ['bubble6', [15, 5, 10]],
      //   ['bubble7', [10, 10]],
      //   ['bubble8', [25, 10]],
      //   ['bubble9', [10, 25, 10, 10]],
      //   ['bubble10', [55, 10]],
      //   ['bubble11', [10, 80, 10, 10]],
      //   ['bubble12', [50, 50]],
      // ];


      const color = d3.scale.ordinal().range(['#f1eef6', '#bdc9e1', '#74a9cf', '#0570b0']);
      const diameter = 500;

      const bubble = d3.layout.pack()
        .value(d => d3.sum(d[1]))
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);
      const arc = d3.svg.arc().innerRadius(0);
      const pie = d3.layout.pie();

      const svg = d3.select('body').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .attr('class', 'bubble');

      const nodes = svg.selectAll('g.node')
        .data(bubble.nodes({ children: this.graphData }).filter(d => !d.children));

      nodes.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

      d3.select('#chart-box')
        .transition()
        .duration(2000);

      const arcGs = nodes.selectAll('g.arc')
        .data(d => pie(d[1]).map((m) => { m.r = d.r; return m; }));

      const arcEnter = arcGs.enter().append('g').attr('class', 'arc');

      arcEnter.append('path')
        .attr('d', (d) => {
          arc.outerRadius(d.r);
          return arc(d);
        })
        .style('fill', (d, i) => color(i));

      arcEnter.append('text')
        .attr({
          x(d) { arc.outerRadius(d.r); return arc.centroid(d)[0]; },
          y(d) { arc.outerRadius(d.r); return arc.centroid(d)[1]; },
          dy: '0.35em',
        })
        .style('text-anchor', 'middle')
        .text(d => d.value);

      const labels = nodes.selectAll('text.label')
        .data((d) => { console.log(d); return [d[0]]; });

      labels.enter().append('text')
        .attr({
          class: 'label',
          dy: '0.35em',
        })
        .style('text-anchor', 'middle')
        .text(String);
    },
  },
  mounted() {
    this.loadMeal();
  },
};
</script>

<style>
  g.arc path {
    stroke: #828282;
    stroke-width: 0.5;
  }
  g.arc text {
    font-size: 10px;
  }
</style>
