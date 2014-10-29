/**
 * Dox Handlebars Helpers
 * Copyright (c) 2014 Gion Kunz
 * Licensed under the WTFPL License (WTFPL).
 */
'use strict';

var path = require('path'),
  _ = require('lodash');

// Export helpers
module.exports.register = function (Handlebars, opt, params)  {
  // The helpers to be exported
  var helpers = {

    doxTag: function(doxElement, doxTagType) {
      return _.find(doxElement.tags, {type: doxTagType});
    },

    doxElementsWithCtxType: function(doxElements, doxCtxType) {
      return _.filter(doxElements, {ctx: {type: doxCtxType}});
    },

    doxTagProperty: function(doxElement, doxTagType, doxTagProperty) {
      var doxTag = helpers.doxTag(doxElement, doxTagType);

      if(doxTag) {
        return doxTag[doxTagProperty];
      } else {
        return doxTag;
      }
    },

    doxTagsOfType: function(doxElement, doxTagType) {
      return _.filter(doxElement.tags, {type: doxTagType});
    }
  };

  opt = opt || {};
  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, helpers[helper]);
    }
  }
};
