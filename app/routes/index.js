import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('https://poise-dash-data.herokuapp.com/').then(function(data) {
      return Object.keys(data).map(function(key) {
        var value = data[key];
        value.id = key;
        return value;
      });
    }, null);
  }
});
