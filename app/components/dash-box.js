import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['boxClass'],
  boxClass: function() {
    var classes = ["project-" + this.get('service'), 'col-md-2'];
    if(this.get('last')) {
      classes.push('right');
    }
    return classes.join(' ');
  }.property('service', 'last'),
  statusClass: function() {
    return "status-" + this.get('status');
  }.property('status')
});
