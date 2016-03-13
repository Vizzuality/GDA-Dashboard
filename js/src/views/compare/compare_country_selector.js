var $ = require('jquery');
  global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars'),
  chosen = require('chosen-jquery-browserify'),
  async = require('async');

var CountriesCollection = require('../../collections/countries.js'),
  YearsCollection = require('../../collections/years.js');

var template = Handlebars.compile(
  require('../../templates/compare/selectors/compare_country_selector.hbs'));

var CountrySelectorView = Backbone.View.extend({

  events: {
    'change .js--compare-selector': 'getCountry'
  },

  initialize: function(options) {
    options = options || {};

    enquire.register("screen and (max-width:640px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:641px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    this.countries = options.countries;
    this.index = options.index;

    this.countriesCollection = new CountriesCollection();
    this.yearsCollection = new YearsCollection();
    this.render();
  },

  getData: function() {
    return this.countriesCollection.fetch();
  },

  render: function() {

    $.when(this.yearsCollection.getYears(), this.getData()).done(function() {

      var countries = this.countriesCollection.toJSON(),
        years = this.yearsCollection.toJSON();

      this.$el.html(template({
        countries: countries ,
        index: this.index,
        years: years
      }));

      this.delegateEvents();

      if (this.countries) {
        this.setRecivedValues();
      };

      if (!this.mobile) {
        this.$('select')
          .chosen({ "disable_search": true });
      }

    }.bind(this));

  },

  setRecivedValues: function() {
    $.each(this.countries, function(i, country) {
      var currentSelector = this.$el.find('#selectcountry-'+ (i+1));
      currentSelector.val(country).trigger('change');
    }.bind(this));
  },

  getCountry: function(e) {
    e && e.preventDefault();
    var selectedCountry = $(e.currentTarget).val();
    var order = $(e.currentTarget).attr('id').split('-')[1];

    Backbone.Events.trigger('country:selected', selectedCountry, order);
  },

  show: function() {
    this.render();
  },

  hide: function() {}
});

module.exports = CountrySelectorView;
