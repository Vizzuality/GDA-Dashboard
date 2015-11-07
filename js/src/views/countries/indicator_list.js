var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var IndicatorView = require('./indicator.js');

var Indicators = require('../../collections/indicators.js'),
    IndicatorService = require('../../lib/services/indicator.js');

var template = Handlebars.compile(
  require('../../templates/countries/indicator_list.hbs'));

var IndicatorListView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.indicators = IndicatorService.groupById(options.indicators);
  },

  render: function() {
    this.$el.html(template({}));

    this.indicators.each(function(indicator) {
      var indicatorView = new IndicatorView({
        indicator: indicator});
      this.$('ul').append(indicatorView.render().el);
    }.bind(this));

    return this;
  }
});

module.exports = IndicatorListView;