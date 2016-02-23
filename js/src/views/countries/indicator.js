var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(
  require('../../templates/countries/indicator.hbs'));

var LineChartView = require('../common/line_chart_view.js'),
  PartialRanksView = require('./partial_ranks.js'),
  TooltipView = require('../common/tooltip_view.js');

var ModalWindowView = require('../common/infowindow_view.js');

var IndicatorView = Backbone.View.extend({

  tagName   : 'li',
  className : 'm-card',

  initialize: function(options) {
    options = options || {};
    this.indicator = options.indicator.toJSON();
    this.currentYear = options.currentYear;
  },

  render: function() {
    if (this.indicator['year'] == this.currentYear) {

      this.$el.html(template(this.indicator));

      this._setColorClass();
      this._setTooltips();
      this.partialRanks();

      if (this.indicator['has_historical_info'] && this.indicator.data[0].score) {
        this.drawGraph();
      }

    } else {
      
      var indicator = this.indicator;
      indicator['score'] = null;

      this.$el.html(template(indicator));
    }

    return this;
  },

  _setColorClass: function() {
    if (!!this.indicator.classColor) {
      this.$el.addClass(this.indicator.classColor);
    }
  },

  partialRanks: function() {
    if ( this.indicator.iso != undefined && this.indicator.score ) {
      new PartialRanksView({
        'el': this.$('.js--partial-ranks'),
        'iso': this.indicator.iso,
        'index': this.indicator.short_name
      });
    }
  },

  _setTooltips: function() {
    var elem = this.$el.find('.c-tooltip');

    if (elem) {
      new TooltipView({el: elem});
    }
  },

  drawGraph: function() {
    var graph = new LineChartView( {
      el: this.$('.js--graph'),
      'indicator': this.indicator
    } );
  }
});

module.exports = IndicatorView;
