'use strict';

var Analytics = {

  page: function(objPage) {

    if (window.ga == undefined) return;

    var page = objPage.page || "";
    var title = objPage.title || "";

    ga('send', 'pageview', {
      page: page,
      title: title
    });

  },

  event: function(event) {

    if (window.ga == undefined) return;

    if (event.category == undefined) {
      console.log('GA:: You have to provide a category', event);
      return;
    }

    if (event.action == undefined) {
      console.log('GA:: You have to provide aN action', event);
      return;
    }

    /*
      category
      action
      label
      value

      ga('send', 'event', 'category', 'action', 'label', value);  // value is a number.
    */

    var category = event.category;
    var action = event.action;
    var label = event.label || "";
    var value = event.value || 0;

    ga('send', 'event', category, action, label, value);

  }

};


module.exports = Analytics;