
<template>
  <div class="BubblePieChart">
    <h3>BubblePieChart</h3>
    <div class="chart-box">

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

/* eslint-disable no-param-reassign */

export default {
  name: 'BubblePieChart',
  components: {

  },
  data() {
    return {
      padding: 1.5, // separation between same-color circles
      clusterPadding: 6, // separation between different-color circles
      width: 500,
      height: 500,

      maxRadius: 25,

      n: 50, // total number of circles
      m: 1, // number of distinct clusters

      // const color = d3.scale.category10()
      //   .domain(d3.range(m));

      // The largest node for each cluster.
      clusters: new Array(this.m),

      pies: null,
    };
  },
  computed: {

  },
  methods: {

    tick(e) {
      this.pies
        .each(this.cluster(10 * e.alpha * e.alpha))
        .each(this.collide(0.5))
        .attr('transform', d => `translate(${d.x},${d.y})`);
    },

    cluster(alpha) {
      return function (d) {
        const cluster = this.clusters[d.cluster];
        if (cluster === d) return;
        let x = d.x - cluster.x;
        let y = d.y - cluster.y;
        let l = Math.sqrt(x * x + y * y);
        const r = d.radius + cluster.radius;
        if (l !== r) {
          l = (l - r) / l * alpha;
          // eslint-disable-next-line no-multi-assign
          d.x -= (x *= l);
          // eslint-disable-next-line no-multi-assign
          d.y -= (y *= l);
          cluster.x += x;
          cluster.y += y;
        }
      };
    },

    collide(alpha) {
      const quadtree = d3.geom.quadtree(this.nodes);
      return function (d) {
        const r = d.radius + this.maxRadius + Math.max(this.padding, this.clusterPadding);
        const nx1 = d.x - r;
        const nx2 = d.x + r;
        const ny1 = d.y - r;
        const ny2 = d.y + r;
        quadtree.visit((quad, x1, y1, x2, y2) => {
          if (quad.point && (quad.point !== d)) {
            let x = d.x - quad.point.x;
            let y = d.y - quad.point.y;
            let l = Math.sqrt(x * x + y * y);
            // eslint-disable-next-line max-len
            const s = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? this.padding : this.clusterPadding);
            if (l < s) {
              l = (l - r) / l * alpha;
              // eslint-disable-next-line no-multi-assign
              d.x -= (x *= l);
              // eslint-disable-next-line no-multi-assign
              d.y -= (y *= l);
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    },

  },
  mounted() {
    const nodes = d3.range(this.n).map(() => {
      const i = Math.floor(Math.random() * this.m);
      const r = Math.sqrt((i + 1) / this.m * -Math.log(Math.random())) * this.maxRadius;
      const d = { cluster: i, radius: r };
      if (!this.clusters[i] || (r > this.clusters[i].radius)) this.clusters[i] = d;
      return d;
    });

    console.log(nodes);

    const force = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', this.tick);

    const svg = d3.select('body').append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.pies = svg.selectAll('.pie')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'pie')
      .call(force.drag);

    const colors = d3.scaleOrdinal(d3.schemeCategory20);

    console.log('pies');
    console.log(this.pies);

    console.log('colors');
    console.log(colors);


    // pies.each((d, i) => {
    //   const pieG = d3.select(this);

    //   const arc = d3.svg.arc()
    //     .outerRadius(d.radius)
    //     .innerRadius(0);

    //   const pie = d3.layout.pie()
    //     .sort(null)
    //     // eslint-disable-next-line no-shadow
    //     .value(d => d);

    //   const data = [Math.random(), Math.random(), Math.random(), Math.random()];

    //   const g = pieG.selectAll('.arc')
    //     .data(pie(data))
    //     .enter().append('g')
    //     .attr('class', 'arc');

    //   g.append('path')
    //     .attr('d', arc)
    //     // eslint-disable-next-line no-shadow
    //     .attr('fill', i => colors(i));
    // });
  },
};
</script>

<style>

</style>
