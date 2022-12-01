/*
 * The Bounce class
 * Pass in an object with:
 * target (String) - The course url
 * width (Number) - The course width
 * height (Number) - The course height
 * title (String) - The course title
 * popout (Boolean) - should this popout into a new window or do a redirect
 * relative (Boolean) - is the url a relative link or absolute.
 * relative cont'd - If set to true, it will prepend the current path
 * @constructor
 */
var TolBounce = function (loadParams) {
  var target,
    popout,
    popped,
    title,
    prepend;

  /*
   * Gets the parameter value from the url
   * @param {String} param the url param to find the value of
   * @param {?String} searcher the location to search
   * @return {String}the parameter value
   */
  getUrlParams = function (param, searcher) {
    if (!searcher) {
      searcher = location.search;
    }
    return decodeURIComponent(
      (new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(searcher) || [, ""])[1].replace(/\+/g, '%20')) || null;
  };

  /*
   * Gets the file directory from a given path
   * @param {String} filePath the url
   * @return {String} the path without the file
   */
  getFileDirectory = function (filePath) {
    if (filePath.indexOf('/') == -1) {
      // windows
      return filePath.substring(0, filePath.lastIndexOf('\\'));
    } else {
      // unix
      return filePath.substring(0, filePath.lastIndexOf('/'));
    }
  };

  /*
   * Cleans up a url's parameters
   * @param {String} url the url
   * @return {String} the url
   */
  cleanUpUrl = function () {
    var queryObject = location.search.toQueryParams(),
      queryString = '',
      param,
      targetUrl;

    for (param in queryObject) {
      queryString += param + '=' + queryObject[param] + '&';
    }

    targetUrl = target.split('?')[0] + '?' + queryString + (typeof (target.split('?')[1]) == 'undefined' ? '' : target.split('?')[1]);

    return targetUrl;
  };

  /*
   * Validates the Querystring
   * @param {String} url the url
   * @return {Boolean} is the url valid
   */
  validateQuery = function (url) {
    var queryObject = url.toQueryParams(),
      param;

    for (param in queryObject) {
      if (typeof (queryObject[param]) != 'string') {
        return false;
      }
    }
    return true;
  };

  /*
   * Set the message to the DOM
   * @param {String} message the message
   * @param {Boolean} error is this an error?
   */
  setMessage = function (message, error) {
    var element = document.getElementById('message'),
      errorString = error ? 'An error has occurred. Please contact <a href="mailto:support@corpedia.com">' +
      'the support team</a> with the following information: <br /><br />' : '';

    if (element) {
      element.innerHTML = errorString + message;
    }
    if (error) {
      document.title = 'Course Load Error';
    }
  };

  /*
   * Add button to the DOM
   * @param {String} message the message
   * @param {Boolean} error is this an error?
   */
  addButtonToMessage = function (message) {
    var id = message.split(' ').join('').toLowerCase();
    if (document.querySelector('#' + id)) {
      return;
    }
    var element = document.getElementById('message');
    var btn = document.createElement("BUTTON");
    btn.id = id;
    btn.innerHTML = message;
    element.appendChild(btn);

    return btn;
  }

  /*
   * Redirects the window to a new location
   */
  redirect = function () {
    var url = cleanUpUrl();
    window.location = url + prepend + 'popped=true';
  }

  /*
   * Pops out the window
   * @param {Boolean} relative is this a relative link?
   */
  popWindow = function (relative) {
    var relativePath,
      locationSearch,
      url,
      options,
      coursewindow;

    relativePath = relative ? getFileDirectory(document.location.pathname) + '/' : '';
    locationSearch = document.location.search;

    // Replace ? to & in the document's query params
    if (locationSearch.indexOf('?') > -1) {
      locationSearch = locationSearch.replace('?', '&');
    }

    if (target.indexOf('?') === -1) {
      target += '?';
      prepend = '&';
    }

    url = relativePath + target + prepend + locationSearch + '&popped=true';
    url = url.replace('&&', '&');

    options = 'width=' + width + ',height=' + height + ',menubar=0,status=0,scrollbars=0,resizable=1,location=0';

    // Open the course window
    coursewindow = window.open(url, '', options);

    // Set initial focus on the course window, if an error occurs it is likely due to a pop up blocker
    try {
      coursewindow.focus();
      setMessage('Please do not close this window while the course is running.');
    } catch (e) {
      setMessage('A popup blocker is preventing the course from opening.<br>Please click the button below to launch the course.<br>');
      var button = addButtonToMessage('Launch Course');
      if (button) {
        Object.assign(button.style, {
          marginTop: '16px',
          fontSize: '18px'
        });

        button.classList.add('pill-button', 'nav-button', 'theme-all', 'hoverable', 'nav-text', 'focusable');

        button.addEventListener('click', function () {
          TolBounce(loadParams);
          button
        });
      }

      document.title = 'Pop-up blocked';
      return false;
    }

    // Log the popout paths
    if (window.console) {
      console.log('relativePath', relativePath);
      console.log('target', target);
      console.log('document.location.search', document.location.search);
      console.log('prepend', prepend);
      console.log('options', options);
      console.log('url', url);
    }

    if (title) {
      document.title = title;
    }

    // Handles this window becoming focused
    window.onfocus = function () {
      if (coursewindow.closed) {
        // If the course window is closed, then close this window as well
        window.close();
      } else {
        // If this window is focused, then focus on the course window
        coursewindow.focus();
      }
    }

    // If this window is closed, close the coursewindow as well
    window.onbeforeunload = function () {
      coursewindow.close();
    }

    // Extra protection in event this window does not become focused after the user closes the coursewindow
    coursewindow.onbeforeunload = function () {
      window.close();
    }
  };


  // Set params
  target = getUrlParams('target') || loadParams['target'];
  popout = getUrlParams('popout') || loadParams['popout'];
  popped = getUrlParams('popped') || loadParams['popped'];
  looping = getUrlParams('looping') || loadParams['looping'];
  width = getUrlParams('width') || loadParams['width'];
  height = getUrlParams('height') || loadParams['height'];
  title = getUrlParams('title') || loadParams['title'] || '';
  prepend = getUrlParams('?') ? '&' : getUrlParams('?', target) ? '&' : '?';


  // Handle looping issues
  if (popped && looping) {
    setMessage('The course window is looping', true);
    return;
  }

  if (target && popout) {
    popWindow(false);
    return;
  } else if (target) {
    redirect();
    return;
  } else {
    document.title = 'Package Error';
    setMessage('Launch parameters were not passed into the package correctly.', true);
    window.close();
    return;
  }

  // Handle looping issues
  if (popped && !looping) {
    window.location = location + '&looping=true';
  }
}
