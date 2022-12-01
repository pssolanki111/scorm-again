function isIE10orLess() {
  var msie = window.navigator.userAgent.indexOf('MSIE ');
  return (msie > 0);
}

function isMobileSafari() {
  var userAgent = window.navigator.userAgent;
  return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
}

function doBounce() {
  document.body.innerHTML = "<h2 id='message' style='padding: 20px; text-align: center; margin-left: auto; margin-right: auto; margin-top: 40px; max-width:680px; background-color:#EEE; border-radius: 10px;'></h2>";
  TolBounce({
    "title": "Loading...",
    "target": "index.html",
    "width": 960,
    "height": 670,
    "popout": true
  });
}

if (isMobileSafari() && window.top !== window.self) {
  doBounce();
}

// If IE 10 or less just print plain html, otherwise print angular root element tag.
if (isIE10orLess()) {
  if (top && top.frames && top.frames.length > 0) {
    doBounce();
  } else {
    document.body.innerHTML = '<table class="no-support"> \
      <tr> \
        <td class="logo"> \
          <img alt="Scholar" src="assets/common/unsupported-browsers/logo.png"> \
        </td> \
        <td > \
          <h1>Your browser is not supported</h1> \
          <div> \
            <a href="https://www.google.com/chrome/"><img src="assets/common/unsupported-browsers/Chrome.png" alt="Google Chrome"> Google Chrome</a> \
            <a href="https://www.mozilla.org/en-US/"><img src="assets/common/unsupported-browsers/Firefox.png" alt="Mozilla Firefox">Mozilla Firefox</a> \
            <a href="https://www.microsoft.com/en-us/download/details.aspx?id=48126" ><img src="assets/common/unsupported-browsers/Edge.png" alt="Microsoft Edge">Microsoft Edge</a> \
            <a href="https://support.microsoft.com/en-us/help/17621/internet-explorer-downloads"><img src="assets/common/unsupported-browsers/IE11.png" alt="Internet Explorer 11">Internet Explorer 11</a> \
            <a href="https://support.apple.com/downloads/safari"><img src="assets/common/unsupported-browsers/Safari.png" alt="Safari">Safari</a> \
          </div> \
        </td> \
      </tr> \
    </table> \
    <style> \
      html, body { height: 100%; margin: 0;} \
      table.no-support { width: 100%; height: 100%; } \
      table.no-support h1, table.no-support td { text-align: center; } \
      table.no-support a { display: inline-block; margin: 16px; text-align: center; } \
      table.no-support img { display: block; margin: 0 auto 16px auto; width: 60px; border: 0px; } \
      table.no-support td.logo { border-right: 1px dashed #eee; } \
      table.no-support td.logo img { border-radius: 100px; width: 90%; } \
    </style>';
  }
}
