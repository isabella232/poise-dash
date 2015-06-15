import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['status-graph'],
  data: [],
  renderGraph: function() {
    var elm = this.$();
    var data = this.get('data');

    var graphData = [
      data[0] + data[1] + data[2],
      data[0] + data[1],
      data[0],
    ];

    var xScale = d3.scale.linear().domain([0, graphData[0]]).range([0, elm.width()]);
    var classScale = d3.scale.ordinal().domain([0, 1, 2]).range(['graph-good', 'graph-nil', 'graph-bad']);
    var graph = d3.select(elm[0]).select('g')
      .selectAll('rect')
      .data(graphData);
    graph
      .attr('width', xScale);
    graph.enter()
      .append('rect')
      .attr('class', function(d, i) { return classScale(i); })
      .attr('width', xScale)
      .attr('height', 5);
    graph.exit()
      .remove();
  }.observes('data').on('didInsertElement')
});
