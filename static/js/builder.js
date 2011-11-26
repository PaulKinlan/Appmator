/*
* Copyright 2010 Paul Kinlan.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.

*/

function EventProxy(method, context) {
  return function(e) { method.call(context, e) };
}

var Builder = new (function () {
  
  // The manifest that we are building.
  var manifest = {};
  // A collection of languages and local information.
  var locales = {};
  
  this.start = function(fn) {
    var callback = fn || function() {};
    
    //// pass to function instead?
    var url = document.getElementById("url");
    
    // Fetch site information
    fetch(url.value, callback);
  };
  
  this.parseManifest = function(e) {
    try {
      var manifestData = JSON.parse(e.target.value);
      if(manifestData) {
        if(validateManifest(manifestData)) {
          manifest = manifestData;
          updateUI();
        }
      }
    } catch(error) { 
//// handled error?    
    }
  };
  
  this.togglePermission = function(e) {
    if(e.target.checked) {
      manifest.permissions.push(e.target.id);
    }
    else {
      var idx = manifest.permissions.indexOf(e.target.id);
      manifest.permissions = manifest.permissions.filter(function(i) {
       if(i != e.target.id) return true;
       else return false; 
      });
    }
    
    updateUI();
  };
  
  this.toggleLaunch = function(e) {
    manifest.app.launch.container = e.target.value;
   
    updateUI();
  };

  this.dragZip = function(e) {
    e.dataTransfer.setData("DownloadURL", "application/zip:" + manifest.name  +":data:image/png;base64," + Builder.output({"binary": false}));
  };
  
  this.updateLanguages = function() {
    
  };
  
  // Outputs the zip file
  this.output = function(options) {
    var outputImage = document.getElementById("output");
    var zip = new JSZip();
    zip.add("16.png", imageToBase64("16"), {base64: true});
    zip.add("128.png", imageToBase64("128"), {base64: true});
    zip.add("manifest.json", JSON.stringify(manifest));
    
    // Render all the files
    for(var l in locales) {
      zip.add("_locales/"+ l +"/messages.json", localeToText(l))
    }
    
    // output the data.
    
    var data = "";
    data = zip.generate(options.binary);
    
    return data;
  };
  
  // Converts the locale to string.  Could be a seperate local object but no need for now.
  var localeToText = function(locale) {
    return JSON.stringify(locales[locale]);
  }
  
//// change variable name icon to iconSize?
  var imageToBase64 = function(icon) {
    var canvas = document.getElementById("c" + icon);
    
    var data = canvas.toDataURL();
    return data.replace("data:image/png;base64,","");
  };
  
  // Loads an image into a canvas
/// change icon to iconSize?
  var loadImage = function(icon,  url) {
    var canvas = document.getElementById("c" + icon);
    var context = canvas.getContext("2d");
    var image = new Image();
    image.src = "/api/image?url=" + url; // Use the proxy so not tainted.
        
    image.addEventListener("load", function() {
      context.drawImage(image, 0, 0, icon, icon); // rescale the image
    });
  };
  
  // Reads an image from the file system
  this.readImage = function(e) {
//// what if other sizes?
    var id = "c16";
    var size = 16;
    if(e.target.id == "file128") {
      id = "c128";
      size = 128;
    }
    
    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    
    for(var i = 0, file; file=e.target.files[i]; i++) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        var img = new Image();
        
        img.addEventListener("load", function() {
          context.drawImage(img, 0, 0, size, size); // rescale the image
        });
        
        img.src = evt.target.result;
        
      };
      reader.readAsDataURL(file)
    }
  };
  
  //Build a valid manifest
//// info instead of inf
  var parseInfo = function(inf) {
    manifest.app = {};
    manifest.app.launch = {};
    manifest.permissions = [];
    manifest.icons = {
      "16": "16.png",
      "128": "128.png"
    };
    
    if(inf.name) {
      manifest.name = inf.name;
    }
    
    if(inf.description) {
      manifest.description = inf.description;
    }
    
    manifest.version = "1.0.0"
    
////??iconSize in inf.iconSizes
    for(var icon in inf.icons) {
      // Don't perform any validation just yet.
      loadImage(icon, inf.icons[icon]);
    }
    
    manifest.app.launch.urls = inf.urls;
    manifest.app.launch.web_url = inf.web_url
    manifest.app.launch.container = "tab"; // explicitly set to default
  };
  
  // Validates the manifest.  Making sure all the correct fields are present.
  var validateManifest = function(m) {
    // Required fields: name, version
    if(!!m.name == false) 
      return null;
      
    if(!!m.version == false) 
      return null;
      
    if(!!m.app.launch.web_url == false)
      return null;

    // Check that the icons are only 16 or 128.  No others allowed.
    
    // It is valid so return the document.
    return m;
  };
  
  this.updateManifest = function() {
    var name = document.getElementById("name");
    var description = document.getElementById("description");
    var version = document.getElementById("version");
    
//// do in one loop?
/*
 var props = ["description", "name", "version"]
 for prop in props {
 	var value = document.getElementById(prop).value;
 	if (value == "") {
 		delete manifest[prop];
 	} else {
 		manifest[prop] = value; 
 	}
}
*/
    
    if(name.value == "")
      delete manifest.name;
    else
      manifest.name = name.value;
    
    if(description.value == "")
      delete manifest.description;
    else 
      manifest.description = description.value;
      
    if(version.value == "")
      delete manifest.version
    else
      manifest.version = version.value;
    
    renderManifest();
    
    //Save the manifest 
    var output = document.getElementById("output");
    output.href = "data:image/png;base64," + 
          Builder.output({"binary": false});
  }
  
  // Update the UI based on the manifest.
  var updateUI = function() {
  	//// add Element to variable names?
    var app = document.getElementById("app");
    var download = document.getElementById("download");
    var info = document.getElementById("info");
    var name = document.getElementById("name");
    var description = document.getElementById("description");
    var version = document.getElementById("version");
    var launch = document.getElementById("launch");
    
    // Launcher options
    var options = {};
    
    // Permissions
    var permissions = {};
    permissions["geolocation"] = document.getElementById("geolocation");
    permissions["notifications"] = document.getElementById("notifications");
    permissions["unlimitedStorage"] = document.getElementById("unlimitedStorage");
    permissions["background"] = document.getElementById("background");
    
    // Container type: tab, window or panel
    var launcher = document.getElementById("launcher");
    
    // The url selector
    var urls = document.getElementById("urls");
    
    // Start updating the UI
	//// put these all in one loop (and move definitions from above)?    
    if(manifest.name)
      name.value = manifest.name;
    else 
      name.value = "";
    
    if(manifest.description)
      description.value = manifest.description;
    else 
      description.value = "";
      
    if(manifest.version)
      version.value = manifest.description;	//// ???
   
    version.value = manifest.version; 		//// ???
    launch.value = manifest.app.launch.web_url;
    
    // Add in the urls that belong to the app.
    urls.options = [];
    
    for (var i = urls.options.length-1; i>=0; i--) {
        urls.removeChild(urls.options[i]);
    }
    
    for(var url in manifest.app.launch.urls) {
      var urlString = manifest.app.launch.urls[url];
      var option = new Option(urlString, urlString);
      urls.options.add(option);
    }
    
    // Toggle the permissions
    for (var p in permissions) {
        permissions[p].checked = false;
    }
    
    for(var permission in manifest.permissions) {
      var permName =  manifest.permissions[permission];
      permissions[permName].checked = true;
    }
    
    // Select the correct launch type
    launcher.value = manifest.app.launch.container;
    
    // Show the class list
    if(app.classList.contains("visible") == false)
      app.classList.toggle("visible");
      
    if(download.classList.contains("visible") == false)
      download.classList.toggle("visible");
      
    renderManifest();
  };
  
  // Renders the manifest from the information provided.
  var renderManifest = function() {
    // Should simply pretty print the JSON.
    var manifestContainer = document.getElementById("manifest");
    var formatter = new goog.format.JsonPrettyPrinter();
    manifestContainer.value = formatter.format(manifest);
  };
  
  var fetch = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/fetch?url=" + url, true);
    request.onreadystatechange = function (e) {
      if(request.status == 200 && request.readyState == 4) {
        var object = JSON.parse(request.responseText);
        parseInfo(object);
        updateUI();
        callback(object);
      }
      else if(request.status != 200) {
        callback(null);
      }
    };
    request.send();
  };
})();