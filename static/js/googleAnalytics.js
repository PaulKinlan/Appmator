var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-114468-21']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackInstalled() {
  debugger;
  var isInstalled = !!(window.chrome && window.chrome.app && window.chrome.app.isInstalled);
  _gaq.push(['_trackEvent', 'Installed', isInstalled.toString()]);
};

function trackEvent(name) {
  _gaq.push(['_trackEvent', 'Actions', name]);
};

document.addEventListener("load", trackInstalled);
