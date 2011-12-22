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
	
	var download = document.getElementById("download");
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
	var urlInput = document.getElementById("url");
	var urlButton = document.getElementById("urlButton");
	var header = document.getElementById("header");
	var iconContainer = document.getElementById("iconContainer");
	
	var downloadLink = document.getElementById("downloadLink");
	
	var name = document.getElementById("name");
	var description = document.getElementById("description");
	var versions = document.getElementById("version");
	
	var launcher = document.getElementById("launcher");
	
	var file128 = document.getElementById("file128");
	
	function showMessage(elementId, message){
		document.getElementById(elementId).innerHTML = message;
	}
	
	function clearMessage(elementId){
		document.getElementById(elementId).innerHTML = "";
	}

	// attempt to validate URL on the client
	// using code from jQuery validation plugin -- with optional scheme
	// not perfect, but better than nothing :-`
	function isUrl(string){
		return /^(https?:\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(string);
	}

	function makePackage() {
		var canvas = document.getElementById("c128");
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		document.getElementById("details").style.display = "none";
		var url = urlInput.value;
		if (!isUrl(url)) {
			showMessage("urlMessage", "This does not appear to be a valid URL. Please try again.");
			urlInput.focus();
			return;
		}
		
		// add protocol to URL if not present
		// a bit of a hack, but better than nothing :-/
		if (!/^https?/i.test(url)) {
			url = "http://" + url;
		};		
		
		function failureCallback(){
			document.body.style.cursor = "";
			download.classList.remove("visible");
			iconContainer.classList.remove("visible");
			details.classList.remove("visible");
			showMessage("urlMessage", "There was an error getting data for this URL. Are you sure it's correct?");
			urlInput.focus();
		}
		
		function successCallback(object){
			document.body.style.cursor = "";
			if(object) {
				clearMessage("urlMessage");
				//			urlInput.classList.add("success");
				//			header.classList.add("started");
				// if first time, display iconContainer
				iconContainer.classList.add("visible");
				// if output already displayed, animate ZIP file creation
				output.classList.remove("updated");
				output.classList.remove("created");
				setTimeout(function(){output.classList.add("created")}, 1);
				trackEvent("Parse Success");
		  	} else {
				failureCallback();
				urlInput.classList.add("error");
				trackEvent("Parse Error");
			}
		}
		
		document.body.style.cursor = "wait";
		Builder.start(url, successCallback, failureCallback);
	}
	
	urlInput.addEventListener("keypress", function(e){
	  if(e.keyCode == 13) {
	  	makePackage();
	  }
	  else {
		urlInput.classList.remove("error");
		urlInput.classList.remove("success");
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
	
	document.getElementById("c128").addEventListener("click", 
		function(e){
			file128.click();
		}
	);

	
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
	  urlInput.value = newUrl;
	  trackEvent("Load with hash");
	  Builder.start(function(object) {
		// Make the UI visible
		if(object) {
		  trackEvent("Parse success");
		  urlInput.classList.add("success");
		  header.classList.add("started");
		  iconContainer.classList.add("visible");
		}
		else {
		  trackEvent("Parse error");
		  urlInput.classList.add("error");
		}
	  });
	}
  });
})();