import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['status-graph'],
  data: [],
  renderGraph: function() {
    var x = function(d, i) { return i * 6; };
    var y = function(d, i) {
      if(d === 'good') {
        return 0;
      } else {
        return 11;
      }
    };
    var applyRect = function(graph) {
      return graph
        .attr('class', function(d) { return 'graph-bar graph-' + d; })
        .attr('x', x)
        .attr('y', y);
    };

    var graph = d3.select(this.$()[0])
        .selectAll('.graph-bar')
        .data(this.get('data'));
    applyRect(graph);
    applyRect(graph.enter().append('rect'))
      .attr('width', 4)
      .attr('height', 10);
    graph.exit()
      .remove();
  }.observes('data').on('didInsertElement')
});
