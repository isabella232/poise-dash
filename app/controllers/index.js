import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'project',
  sortProperties: ['id'],
  needs: ['application'],
  filteredProjects: function() {
    var filter = this.get('controllers.application.filterString');
    return this.filter(function(item) {
      return filter ? item.get('id').indexOf(filter) !== -1 : true;
    });
  }.property('@each.id', 'controllers.application.filterString')
});
