var Builder = new (function () {
  
  var manifest = {};
  
  this.start = function(e) {
    var url = document.getElementById("url");
    
    // Fetch Site information
    fetch(url.value);
  };
  
  //Build a valid manifest
  var parseInfo = function(inf) {
    manifest.app = {};
    manifest.icons = {};
    
    if(inf.name) {
      manifest.name = inf.name;
    }
    
    if(inf.description) {
      manifest.description = inf.description;
    }
    
    for(var icon in inf.icons) {
      // Don't perform any validation just yet.
      manifest[icon] = inf.icons[icon];
    }
  };
  
  var validateManifest = function() {
    
  };
  
  var updateUI = function() {
    var app = document.getElementById("app");
    var info = document.getElementById("info");
    var download = document.getElementById("download");
    var name = document.getElementById("name");
    var description = document.getElementById("description");
    var version = document.getElementById("version");
    var launch = document.getElementById("launch");
    
    var urls = document.getElementById("urls");
    
    if(manifest.name)
      name.value = manifest.name;
    
    if(manifest.description)
      description.value = manifest.description;
    
    version.value = manifest.version;
    launch.value = manifest.app.web_url;
    
    // Show the class list
    app.classList.toggle("visible");
  };
  
  // Renders the manifest from the information provided.
  var renderManifest = function(inf) {
    
  };
 
  var fetch = function(url) {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/fetch?url=" + url, true);
    request.onreadystatechange = function (e) {
      if(request.status == 200 && request.readyState == 4) {
        var object = JSON.parse(request.responseText);
        parseInfo(object);
        updateUI();
      }
    };
    request.send();
  };
})();