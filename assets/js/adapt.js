// JSLint settings:
/*global
  ADAPT_CONFIG
  clearTimeout
  setTimeout
*/

/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs
*/

// Closure.
(function(w, d, config, undefined) {
  // If no config, exit.
  if (!config) {
    return;
  }

  // Empty vars to use later.
  var url, url_old, timer;

  // Alias config values.
  var callback = typeof config.callback === 'function' ? config.callback : undefined;
  var path = config.path ? config.path : '';
  var range = config.range;
  var range_len = range.length;
  var file_suffix = config.suffix || '.css';

  // Create empty link tag:
  // <link rel="stylesheet" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';
  css.media = 'screen';

  // Called from within adapt().
  function change(range, i, width) {
    // Set the URL.
    css.href = url;
    url_old = url;

    // Call callback, if defined.
    callback && callback(range, i, width);
  }

  // Adapt to width.
  function adapt() {
    // This clearTimeout is for IE.
    // Really it belongs in react(),
    // but doesn't do any harm here.
    clearTimeout(timer);

    // Parse viewport width.
    var width = d.documentElement ? d.documentElement.clientWidth : 0;

    // How many ranges?
    var i = range_len;
    var last = range_len - 1;
    var prevFrom;
    var thisRange;

    while (i--) {
      // Blank if no conditions met.
      url = '';

      // Shortcut
      thisRange = range[i];

      // Check for maximum or range.
      if ((!prevFrom && i === last && width > prevFrom) || (width > thisRange.from && width <= prevFrom)) {
        // Build full URL to CSS file.
        thisRange.name && (url = path + thisRange.name + file_suffix);

        // Exit the while loop. No need to continue
        // if we've already found a matching range.
        break;
      }

      prevFrom = thisRange.from;
    }

    // Was it created yet?
    if (!url_old) {
      // Apply changes.
      change(thisRange, i, width);

      // Add the CSS, only if path is defined.
      // Use faster document.head if possible.
      path && (d.head || d.getElementsByTagName('head')[0]).appendChild(css);
    }
    else if (url_old !== url) {
      // Apply changes.
      change(thisRange, i, width);
    }
  }

  // Fire off once.
  adapt();

  // Slight delay.
  function react() {
    // Clear the timer as window resize fires,
    // so that it only calls adapt() when the
    // user has finished resizing the window.
    clearTimeout(timer);

    // Start the timer countdown.
    timer = setTimeout(adapt, 16);
    // -----------------------^^
    // Note: 15.6 milliseconds is lowest "safe"
    // duration for setTimeout and setInterval.
    //
    // http://www.nczonline.net/blog/2011/12/14/timer-resolution-in-browsers
  }

  // Do we want to watch for
  // resize and device tilt?
  if (config.dynamic) {
    // Event listener for window resize,
    // also triggered by phone rotation.
    if (w.addEventListener) {
      // Good browsers.
      w.addEventListener('resize', react, false);
    }
    else if (w.attachEvent) {
      // Legacy IE support.
      w.attachEvent('onresize', react);
    }
    else {
      // Old-school fallback.
      w.onresize = react;
    }
  }

// Pass in window, document, config, undefined.
})(this, this.document, ADAPT_CONFIG);