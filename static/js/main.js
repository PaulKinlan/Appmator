(function() {
  
  Modernizr.addTest('classlist', function () {
	var div = document.createElement("div");
	var ret = (!!div.classList);
	delete div;
	return ret;
  });
  
  Modernizr.addTest('typedarray', function () {
	return ("Uint8Array" in window);
  });
  
Modernizr.addTest('blobbuilder', function() {
	return !!window.Blob && !!window.WebKitBlobBuilder && 
		!!webkitURL.createObjectURL;
});
  
  window.addEventListener("DOMContentLoaded", function() {
	
	var warning = document.getElementById("warning");
	
	if(!( Modernizr.draganddrop && 
		  Modernizr.classlist &&
		  Modernizr.blobbuilder &&
		  Modernizr.canvas)){
	  warning.style.display = "block";
	}
	
	var app = document.getElementById("app");
	var language = document.getElementById("language");
	var start = document.getElementById("start");
	var icon128 = document.getElementById("icon128");
	var offlineEnabledTrue = document.getElementById("offlineEnabledTrue");
	var offlineEnabledFalse = document.getElementById("offlineEnabledFalse");
	var notifications = document.getElementById("notifications");
	var unlimitedStorage = document.getElementById("unlimitedStorage");
	var geolocation = document.getElementById("geolocation");
	var background = document.getElementById("background");
	var backgroundPageContainer = document.getElementById("backgroundPageContainer");
	var manifest = document.getElementById("manifest");
	var output = document.getElementById("output");
	var packaged = document.getElementById("packaged");
	var url = document.getElementById("url");
	var urlButton = document.getElementById("urlButton");
	var header = document.getElementById("header");
	
	var downloadLink = document.getElementById("downloadLink");
	
	var name = document.getElementById("name");
	var description = document.getElementById("description");
	var versions = document.getElementById("version");
	
	var launcher = document.getElementById("launcher");
	
	var file128 = document.getElementById("file128");


	function makePackage() {
		Builder.start(function(object) {
		  // Make the UI visible
		  if(object) {
			url.classList.add("success");
			header.classList.add("started");
			app.classList.add("visible");
			trackEvent("Parse Success");
			output.classList.add("success");
		  }
		  else {
			url.classList.add("error");
			trackEvent("Parse Error");
		  }
		});
	}
	
	url.addEventListener("keypress", function(e){
	  if(e.keyCode == 13) {
	  	makePackage();
	  }
	  else {
		url.classList.remove("error");
		url.classList.remove("success");
	  }
	});
	urlButton.addEventListener("click", makePackage);
	  
	name.addEventListener("change", Builder.updateManifest);
	description.addEventListener("change", Builder.updateManifest);
	version.addEventListener("change", Builder.updateManifest);
	backgroundPage.addEventListener("change", function(){
		background.checked = this.value === "" ? false : true;
		Builder.updateManifest;	
	});
	
	name.addEventListener("blur", Builder.updateManifest);
	description.addEventListener("blur", Builder.updateManifest);
	version.addEventListener("blur", Builder.updateManifest);
	backgroundPage.addEventListener("blur", function() {
		background.checked = this.value === "" ? false : true;
		Builder.updateManifest();
	});
	
	offlineEnabledTrue.addEventListener("click", Builder.updateManifest);
	offlineEnabledFalse.addEventListener("click", Builder.updateManifest);
	
	unlimitedStorage.addEventListener("click", Builder.togglePermission);
	geolocation.addEventListener("click", Builder.togglePermission);
	notifications.addEventListener("click", Builder.togglePermission);
	background.addEventListener("click", Builder.togglePermission);
	background.addEventListener("change", function(){
		if (this.checked) {
			backgroundPageContainer.classList.add("visible");
		} else {
			backgroundPage.value = "";
			backgroundPageContainer.classList.remove("visible");
		}
		return true;
	});
	
	launcher.addEventListener("change", Builder.toggleLaunch);
	
	file128.addEventListener("change", Builder.readImage);
//	file128.addEventListener("click", Builder.readImage);
//	icon128.addEventListener("click", Builder.readImage);
	
	function clickFile128Input(e) {
		file128.click();
//		e.stopPropagation();
	}
	document.getElementById("chooseIconImage").addEventListener("click", clickFile128Input);
	document.getElementById("c128").addEventListener("click", clickFile128Input);

	
	function clickFile128Input(e) {
		file128.click();
	}
	document.getElementById("c128").addEventListener("click", clickFile128Input);

	
	manifest.addEventListener("blur", Builder.parseManifest);
	
	output.addEventListener("dragstart", EventProxy(Builder.dragZip, Builder));
	if(Modernizr.typedarray) {
	  	  
	  downloadLink.addEventListener("click", function() {
		var bb = new WebKitBlobBuilder();
	  
		var output = Builder.output({"binary":true});
		var ui8a = new Uint8Array(output.length);
	  
		for(var i = 0; i< output.length; i++) {
		  ui8a[i] = output.charCodeAt(i);
		}
	  
		bb.append(ui8a.buffer);
	  
		var blob = bb.getBlob("application/octet-stream");
//		var saveas = document.createElement("iframe");
//		saveas.style.display = "none";
		
		if(!!window.createObjectURL == false) {
// 		  saveas.src = window.webkitURL.createObjectURL(blob);
		  downloadLink.href = window.webkitURL.createObjectURL(blob); 
		}
		else {
// 		  saveas.src = window.createObjectURL(blob); 
		  downloadLink.href = window.createObjectURL(blob);
		}
		downloadLink.download = name.value + ".zip";		
		downloadLink.name = name.value;		
//		document.body.appendChild(saveas);
	  });
	}
	
	// If there is a hash load URL from that
	if(window.location.hash && window.location.hash !="") {
	  var newUrl = window.location.hash.substr(1);
	  url.value = newUrl;
	  trackEvent("Load with hash");
	  Builder.start(function(object) {
		// Make the UI visible
		if(object) {
		  trackEvent("Parse success");
		  url.classList.add("success");
		  header.classList.add("started");
		  app.classList.add("visible");
		}
		else {
		  trackEvent("Parse error");
		  url.classList.add("error");
		}
	  });
	}
  });
})();
