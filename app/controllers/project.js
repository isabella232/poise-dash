import Ember from 'ember';

var travisStatus = function(state) {
  if(state === 'passed' || state === 'ready') {
    return 'good';
  } else if(state === 'failed') {
    return 'bad';
  } else {
    return 'nil';
  }
};

export default Ember.Controller.extend({
  id: Ember.computed.alias('model.id'),
  name: function() {
    return this.get('id').split(/\//).get('lastObject');
  }.property('id'),
  href: function() {
    return 'https://github.com/' + this.get('id');
  }.property('id'),

  commit: Ember.computed.alias('model.github.branch.commit.sha'),
  commitShort: function() {
    return this.get('commit').substr(0, 7);
  }.property('commit'),
  commitRelative: function() {
    return moment(this.get('model.github.branch.commit.commit.committer.date')).fromNow();
  }.property('model.github.branch.commit.commit.committer.date'),
  commitHref: function() {
    return 'https://github.com/' + this.get('id') + '/commit/' + this.get('commit');
  }.property('id', 'commit'),

  travisLabel: function() {
    var n = this.get('model.travis.firstObject.number');
    return n ? '#'+n : '';
  }.property('model.travis.firstObject.number'),
  travisStatus: function() {
    return travisStatus(this.get('model.travis.firstObject.state'));
  }.property('model.travis.firstObject.state'),
  travisHref: function() {
    return 'https://travis-ci.org/' + this.get('id') + '/builds/' + this.get('model.travis.firstObject.id');
  }.property('id', 'model.travis.firstObject.id'),
  travisData: function() {
    return this.get('model.travis').slice(-10).map(function(build) {
      return travisStatus(build.state);
    });
  }.property('model.travis.@each.state'),

  codecovLabel: function() {
    var perc = this.get('model.codecov.report.coverage');
    return perc ? Math.floor(perc) + '%' : '';
  }.property('model.codecov.report.coverage'),
  codecovStatus: function() {
    var perc = this.get('model.codecov.report.coverage');
    return perc ? perc < 80 ? 'bad' : 'good' : 'nil';
  }.property('model.codecov.report.coverage'),
  codecovHref: function() {
    return 'https://codecov.io/github/' + this.get('id');
  }.property('id'),

  codeclimateLabel: function() {
    return this.get('model.codeclimate.gpa');
  }.property('model.codeclimate.gpa'),
  codeclimateStatus: function() {
    var gpa = this.get('model.codeclimate.gpa');
    return gpa ? parseFloat(gpa) <= 3 ? 'bad' : 'good' : 'nil';
  }.property('model.codeclimate.gpa'),
  codeclimateHref: function() {
    return 'https://codeclimate.com/github/' + this.get('id');
  }.property('id'),
  codeclimateData: function() {
    var donut = this.get('model.codeclimate.donut');
    return [
      donut[4].value + donut[3].value,
      donut[2].value,
      donut[1].value + donut[0].value
    ];
  }.property('model.codeclimate.donut.@each.value'),

  gemnasiumCounts: function() {
    var counts = {green: 0, yellow: 0, red: 0};
    if(!this.get('model.gemnasium')) {
      return counts;
    }
    this.get('model.gemnasium').forEach(function(pkg) {
      counts[pkg.color] += 1;
    });
    return counts;
  }.property('model.gemnasium.@each.color'),
  gemnasiumOutdated: function() {
    return this.get('gemnasiumCounts.yellow') + this.get('gemnasiumCounts.red');
  }.property('gemnasiumCounts.yellow', 'gemnasiumCounts.red'),
  gemnasiumLabel: function() {
    return this.get('model.gemnasium') ? this.get('gemnasiumOutdated') || Ember.String.htmlSafe('<i class="fa fa-check" title="All dependencies up to date."></i>') : '';
  }.property('model.gemnasium', 'gemnasiumOutdated'),
  gemnasiumStatus: function() {
    return this.get('model.gemnasium') ? ( this.get('gemnasiumOutdated') === 0 ? 'good' : 'bad' ) : 'nil';
  }.property('model.gemnasium', 'gemnasiumOutdated'),
  gemnasiumHref: function() {
    return 'https://gemnasium.com/' + this.get('id');
  }.property('id'),
  gemnasiumShowGraph: function() {
    return this.get('model.gemnasium') && this.get('gemnasiumOutdated') != 0;
  }.property('model.gemnasium', 'gemnasiumOutdated'),
  gemnasiumData: function() {
    return [
      this.get('gemnasiumCounts.red'),
      this.get('gemnasiumCounts.yellow'),
      this.get('gemnasiumCounts.green')
    ];
  }.property('gemnasiumCounts.green', 'gemnasiumCounts.yellow', 'gemnasiumCounts.red'),

  githubPullsCount: function() {
    return this.get('model.github.pulls').length;
  }.property('model.github.pulls.[]'),
  githubOpenCount: function() {
    return this.get('model.github.repo.open_issues_count');
  }.property('model.github.repo.open_issues_count'),
  githubLabel: function() {
    return this.get('githubOpenCount');
  }.property('githubOpenCount'),
  githubStatus: function() {
    return this.get('githubOpenCount') >= 10 ? 'bad' : 'good';
  }.property('githubOpenCount'),
  githubHref: function() {
    return 'https://github.com/' + this.get('id') + '/issues?q=is%3Aopen';
  }.property('id')
});
