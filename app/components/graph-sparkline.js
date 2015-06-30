import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['status-graph'],
  data: [],
  renderGraph: function() {
    var elm = this.$();
    var data = this.get('data');

    var w = elm.width();
    var h = elm.height();

    var xMargin = 4;
    var yMargin = 4;

    var y = d3.scale.linear().domain([d3.min(data), d3.max(data)]).range([yMargin, h - yMargin]);
    var x = d3.scale.linear().domain([0, data.length - 1]).range([xMargin, w - xMargin]);

    var gradientY = d3.scale.threshold().domain([50, 90]).range(['#E00', '#FFEE00', '#0A0']);

    var percentageMargin = 100 / data.length;

    var percentageX = d3.scale.linear().domain([0, data.length - 1]).range([percentageMargin, 100 - percentageMargin]);

    var graph = d3.select(elm[0]);

    var line = d3.svg.line().interpolate("cardinal").x(function(d, i) {
      return x(i);
    }).y(function(d) {
      return h - y(d);
    });

    var gradientId = 'sparkline-gradient-' + this.get('elementId');

    // Clear existing elements.
    graph.selectAll('g,defs').remove();

    graph
      .append("svg:g")
      .attr("stroke", "url(#"+gradientId+")")
      .attr("fill", "url(#"+gradientId+")")
      .append('svg:path')
      .attr("d", line(data));

    graph
      .append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .attr('gradientUnits', "userSpaceOnUse")
      .selectAll(".gradient-stop")
      .data(data)
      .enter()
        .append("svg:stop")
        .attr('offset', function(d, i) {
          return percentageX(i) + "%";
        }).attr("style", function(d) {
          return "stop-color:" + gradientY(d) + ";stop-opacity:1";
        });
  }.observes('data').on('didInsertElement')
});
