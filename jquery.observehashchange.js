(function($) {
  $.fn.hashchange = function(fn) {
    $(window).bind("hashchange", fn);
    return this;
  };

  $.observeHashChange = function(options) {
    var opts = $.extend({}, $.observeHashChange.defaults, options);
    if (window.onhashchange) {
      nativeVersion(opts);
    }
    else {
      setIntervalVersion(opts);
    }
  };

  var locationHash = null;
  var functionStore = null;
  var interval = 0;

  $.observeHashChange.defaults = {
    interval : 500
  };

  function nativeVersion(opts) {
    locationHash = document.location.hash;
    if (window.onhashchange != functionStore) {
      fuctionStore = onhashchangeHandler(window.onhashchange);
      window.onhashchange = functionStore;
    }
  }

  function onhashchangeHandler(oldVersion) {
    return function() {
      var oldHash = locationHash;
      locationHash = document.location.hash;
      $(window).trigger("hashchange", {before: oldHash, after: locationHash});
      return oldVersion.call(this, arguments);
    };
  }

  function setIntervalVersion(opts) {
    if (locationHash == null) {
      locationHash = document.location.hash;
    }
    if (functionStore != null) {
      clearInterval(functionStore);
    }
    if (interval != opts.interval) {
      functionStore = setInterval(checkLocationHash, opts.interval); 
      interval = opts.interval;
    }
  }

  function checkLocationHash() {
    if (locationHash != document.location.hash) {
      var oldHash = locationHash;
      locationHash = document.location.hash;
      $(window).trigger("hashchange", {before: oldHash, after: locationHash});
    }
  }

  $.observeHashChange();
})(jQuery);
