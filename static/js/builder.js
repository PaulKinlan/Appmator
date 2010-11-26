var Builder = new (function () {
  this.start = function(e) {
    var url = document.getElementById("url");
    
    // Fetch Site information
    fetch(url.value);
  };
  
  var updateUI = function(inf) {
    var app = document.getElementById("app");
    var info = document.getElementById("info");
    var download = document.getElementById("download");
    var name = document.getElementById("name");
    var description = document.getElementById("description");
    var version = document.getElementById("version");
    var launch = document.getElementById("launch");
    
    name.value = inf.name;
    description.value = inf.description;
    version.value = "1";
    launch.value = "";
    
    // Show the class list
    app.classList.toggle("visible");
    
  };
 
  var fetch = function(url) {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/fetch?url=" + url, true);
    request.onreadystatechange = function (e) {
      if(request.status == 200 && request.readyState == 4) {
        var object = JSON.parse(request.responseText);
        updateUI(object);
      }
    };
    request.send();
  };
})();