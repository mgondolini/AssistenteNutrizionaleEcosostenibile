
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>
    <div class="chart-box" id="chart-box">

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

console.log(d3);
/* eslint-disable no-param-reassign */

export default {
  name: 'BubblePieChart',
  components: {

  },
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
    createGraph() {
      const data = [
        ['bubble1', [10, 20]],
        ['bubble2', [5, 7]],
        ['bubble3', [6, 6, 10]],
        ['bubble4', [12, 14]],
        ['bubble5', [14, 4]],
        ['bubble6', [15, 5, 10]],
        ['bubble7', [10, 10]],
        ['bubble8', [25, 10]],
        ['bubble9', [10, 25, 10, 10]],
        ['bubble10', [55, 10]],
        ['bubble11', [10, 80, 10, 10]],
        ['bubble12', [50, 50]],
      ];

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
        .data(bubble.nodes({ children: data }).filter(d => !d.children));
      nodes.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

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
    this.createGraph();
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
