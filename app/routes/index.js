import Ember from 'ember';
import config from 'poise-dash/config/environment';

export default Ember.Route.extend({
  model: function() {
    var url = config.APP.dataUrl || 'poise-dash-data';
    if(url.indexOf('://') === -1) {
      url = 'https://' + url + '.herokuapp.com/';
    }
    return Ember.$.getJSON(url).then(function(data) {
      return Object.keys(data).map(function(key) {
        var value = data[key];
        value.id = key;
        return value;
      });
    }, null);
  },
  actions: {
    refresh: function() {
      this.refresh();
    }
  }
});
