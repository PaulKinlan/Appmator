(function() {
  var app_id = "pndpgaogppgnfdnagodccjlhfjgdefij";
  var app_name = "Appmator";
  var message = "Install this app into Chrome"; 
  var install_message = ""; 
  var install_image = "http://cws-badge.appspot.com/images/webstore-logo.png";
  var cancel_message = "";
  var cancel_image = "http://cws-badge.appspot.com/images/cancel.png";
  var css_url = "data:text/css;base64,Ll93ZWJzdG9yZV9iYWRnZSB7CiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDsKICBtYXJnaW46IDAgNTBweCAwIDUwcHg7CiAgYm94LXNoYWRvdzogIzAwMCAwIDAgNXB4OwogIGJhY2tncm91bmQtY29sb3I6ICNlYWU4OGM7CiAgYm9yZGVyOiBzb2xpZCAxcHggI2M5Yzc3ODsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiAwcHg7CiAgcmlnaHQ6IDBweDsKICBwYWRkaW5nOiA1cHg7CiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4OwogIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA1cHg7CiAgZGlzcGxheTogaW5saW5lOwogIGZvbnQtZmFtaWx5OiBBcmlhbDsKICBvcGFjaXR5OiAxOwogIHdpZHRoOiAxMjhweDsKICBoZWlnaHQ6IDE2NXB4Owp9CgouX3dlYnN0b3JlX2JhZGdlOmhvdmVyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjJmMDkwOwp9CgouX3dlYnN0b3JlX2JhZGdlIC5fd2Vic3RvcmVfbWVzc2FnZSB7CiAgdGV4dC1hbGlnbjogY2VudGVyOwogIHdpZHRoOiAxMDAlOwogIGRpc3BsYXk6IGJsb2NrOwogIHRleHQtc2hhZG93OiAjNjY2IDBweCAxcHggMXB4OwogIGZvbnQtd2VpZ2h0OiA3MDA7Cn0KCi5fd2Vic3RvcmVfYmFkZ2UgLl93ZWJzdG9yZV9pbnN0YWxsIHsKICBkaXNwbGF5OiBibG9jazsKICBtYXJnaW4tdG9wOiA1cHg7CiAgd2lkdGg6IDEyOHB4OwogIGhlaWdodDogMTI4cHg7Cn0KCi5fd2Vic3RvcmVfYmFkZ2UgLl93ZWJzdG9yZV9jYW5jZWwgewogIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7CiAgcG9zaXRpb246IGFic29sdXRlOwogIHRvcDogMDsKICByaWdodDogMnB4OwogIG9wYWNpdHk6IDA7Cn0KCi5fd2Vic3RvcmVfYmFkZ2U6aG92ZXIgLl93ZWJzdG9yZV9jYW5jZWwgewogIG9wYWNpdHk6IDE7Cn0=";
  var cookie_name = "_webstore__rTyf";
  var isInstalled = !!(window.chrome && window.chrome.app && window.chrome.app.isInstalled && !(window.location.host == "badgemator.appspot.com"));
  var isCancelled = !!(document.cookie.indexOf(cookie_name + "=true") >= 0);
  
  if(window.navigator.userAgent.indexOf("Chrome/") >= 0 && (!isInstalled && !isCancelled)) {
    var onloaded = function() {
      var container = document.createElement("span");
      container.className = "_webstore_badge";
      
      document.styleSheets[0].addRule("._webstore_badge", "opacity:0", 0);
      
      if(message) {
        var message_element = document.createElement("span");
        message_element.className = "_webstore_message";
        message_element.innerText = message;
        container.appendChild(message_element);
      }
      
      var link = document.createElement("a");
      link.href = "http://chrome.google.com/webstore/detail/" + app_id;
      link.target = "_blank";
      link.className = "_webstore_install";
      container.appendChild(link);
       
      if(install_message) {
        link.innerText = install_message;
        link.alt = "Installs " + app_name; 
      }
      else if(install_image) {
        var img = new Image();
        img.src = install_image;
        link.appendChild(img);
        link.alt = "Installs " + app_name; 
      }
      
      var close = document.createElement("a");
      close.className = "_webstore_cancel";
      close.href = "#";
      
      close.addEventListener("click", function(e) {
        // Set a cookie, that we will respect if the user cancels.
        container.style.display = "none";
        document.cookie = cookie_name + "=true";
        e.preventDefault();
        return false;
      });
      if(cancel_message) {
        close.innerText = cancel_message;
      }
      else if(cancel_image) {
        var img = new Image();
        img.src = cancel_image;
        
        img.alt = "Cancel Prompt"; 
        close.appendChild(img);
      }
      container.appendChild(close);
      
      if(css_url) {
        var css_link = document.createElement("link");
        css_link.rel = "stylesheet";
        css_link.title = "webstore_badge";
        css_link.href = css_url;
        document.head.appendChild(css_link);
      }
      document.body.appendChild(container);
    };
    
    if(document.readyState == "complete") {
      onloaded();
    }
    else {
      document.addEventListener("DOMContentLoaded", onloaded);
    }
  }
})();