var jsonFormatter = function() {
  
  var tabLevel = 1;
  var softTabs = 2;
  
  var i = 0;
  var data = "";
  
  /*
    We are only going to format objects, not strings.  If it can't be an object
    it is not valid anyway.
  */
  this.format = function(obj) {
    
    var type = typeof(obj);
    
    switch(type) {
      case "object":
        output += "{\n";
        
        for(var attr in obj) {
          output += attr + " : " + format(obj[attr]) +"\n";
        }
        
        output += "}";
        
        break;
      case "array":
        output += "[\n";
        
        for(var attr in obj) {
          output += format(obj[attr]);
        }
        
        output += "],\n";
        break;
      case "string":
        out
        break;
    }  
    
    return output; 
  }  
  
};

var stringTokenizer 