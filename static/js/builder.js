var Builder = new (function () {
  
  // The manifest that we are building.
  var manifest = {};
  
  this.start = function(e) {
    var url = document.getElementById("url");
    
    // Fetch Site information
    fetch(url.value);
  };
  
  //Build a valid manifest
  var parseInfo = function(inf) {
    manifest.app = {};
    manifest.app.launch = {};
    manifest.permissions = [];
    manifest.icons = {};
    
    if(inf.name) {
      manifest.name = inf.name;
    }
    
    if(inf.description) {
      manifest.description = inf.description;
    }
    
    manifest.version = "0.0.0.1"
    
    for(var icon in inf.icons) {
      // Don't perform any validation just yet.
      manifest.icons[icon] = inf.icons[icon];
    }
    
    manifest.app.launch.urls = inf.urls;
    manifest.app.launch.web_url = inf.web_url
    manifest.app.launch.container = "tab"; // set it to the default, but clearly
  };
  
  // Validates the manifest.  Making sure all the correct fields are present.
  var validateManifest = function() {
    // Required fields: name, version
    if(!!manifest.name == false) 
      return false;
      
    if(!!manifest.version == false) 
      return false;
      
    if(!!manifest.app.launch.web_url == false)
      return false;
      
    // Check that the icons are only 16 or 128.  No others allowed.
  };
  
  // Updates the User Interface based on the manifest.
  var updateUI = function() {
    var app = document.getElementById("app");
    var info = document.getElementById("info");
    var download = document.getElementById("download");
    var name = document.getElementById("name");
    var description = document.getElementById("description");
    var version = document.getElementById("version");
    var launch = document.getElementById("launch");
    
    // Launcher options
    var options = {};
    options["window"] = document.getElementById("newwindow");
    options["tab"] = document.getElementById("newtab");
    options["panel"] = document.getElementById("newpanel");
    
    // The urls selection
    
    var urls = document.getElementById("urls");
    
    // Start updating the UI
    
    if(manifest.name)
      name.value = manifest.name;
    
    if(manifest.description)
      description.value = manifest.description;
      
    if(manifest.version)
      version.value = manifest.description;
    
    version.value = manifest.version;
    launch.value = manifest.app.launch.web_url;
    
    // Add in the urls that belong to the app.
    urls.options = [];
    for(var url in manifest.app.launch.urls) {
      var urlString = manifest.app.launch.urls[url];
      var option = new Option(urlString, urlString);
      urls.options.add(option);
    }
    
    // Select the correct launch type
    var container = manifest.app.launch.container;
    options[container].checked = true;
    
    // Show the class list
    if(app.classList.contains("visible") == false)
      app.classList.toggle("visible");
      
    renderManifest();
  };
  
  // Renders the manifest from the information provided.
  var renderManifest = function() {
    // Should simply pretty print the JSON.
    var manifestContainer = document.getElementById("manifest");
    manifestContainer.innerText = JSON.stringify(manifest);
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