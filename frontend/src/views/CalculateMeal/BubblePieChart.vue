
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
      /* eslint-disable no-unused-vars */
      /* eslint-disable no-multi-assign */
      /* eslint-disable max-len */

      const width = 500;
      const height = 500;
      const padding = 1.5; // separation between same-color circles
      const clusterPadding = 6; // separation between different-color circles
      const maxRadius = 25;

      const n = 50; // total number of circles
      const m = 1; // number of distinct clusters

      const color = d3.scale.category10()
        .domain(d3.range(m));

      console.log(color);

      // The largest node for each cluster.
      const clusters = new Array(m);

      const nodes = d3.range(n).map(() => {
        const i = Math.floor(Math.random() * m);
        const r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
        const d = { cluster: i, radius: r };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        return d;
      });

      let tick = null;

      const force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0.02)
        .charge(0)
        .on('tick', tick)
        .start();

      const svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

      const pies = svg.selectAll('.pie')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'pie')
        .call(force.drag);

      const colors = d3.scale.category20();

      pies.each(function (d, i) {
        const pieG = d3.select(this);

        const arc = d3.svg.arc()
          .outerRadius(d.radius)
          .innerRadius(0);

        const pie = d3.layout.pie()
          .sort(null)
          .value(d2 => d2);

        const data = [Math.random(), Math.random(), Math.random(), Math.random()];

        const g = pieG.selectAll('.arc')
          .data(pie(data))
          .enter().append('g')
          .attr('class', 'arc');

        g.append('path')
          .attr('d', arc)
          .attr('fill', (d2, i2) => colors(i2));
      });

      // Move d to be adjacent to the cluster node.
      function cluster(alpha) {
        return function (d) {
          const cluster2 = clusters[d.cluster];
          if (cluster2 === d) return;
          let x = d.x - cluster2.x;
          let y = d.y - cluster2.y;
          let l = Math.sqrt(x * x + y * y);
          const r = d.radius + cluster2.radius;
          if (l !== r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster2.x += x;
            cluster2.y += y;
          }
        };
      }

      // Resolves collisions between d and all other circles.
      function collide(alpha) {
        const quadtree = d3.geom.quadtree(nodes);
        return function (d) {
          const r = d.radius + maxRadius + Math.max(padding, clusterPadding);
          const nx1 = d.x - r;
          const nx2 = d.x + r;
          const ny1 = d.y - r;
          const ny2 = d.y + r;
          quadtree.visit((quad, x1, y1, x2, y2) => {
            if (quad.point && (quad.point !== d)) {
              let x = d.x - quad.point.x;
              let y = d.y - quad.point.y;
              let l = Math.sqrt(x * x + y * y);
              const r2 = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
              if (l < r2) {
                l = (l - r2) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }

      tick = (e) => {
        pies
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(0.5))
          .attr('transform', d => `translate(${d.x},${d.y})`);
      };
    },
  },
  mounted() {
    this.createGraph();
  },
};
</script>

<style>

</style>
