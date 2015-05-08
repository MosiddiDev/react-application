// My uTiLs
var Utils = {
	loadResource: function(file, callback) {   
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");
		xhr.open('GET', 'resources/'+file, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == "200") {
				callback(xhr.responseText);
			}
		};
		xhr.send(null);
	}
}

// My sHiMs
Array.prototype.divideArray = function(perGroup){
	var returnArray = [];

	while(this.length > 0){
		returnArray.push(this.splice(0, perGroup));
	}

	return returnArray;
}

Number.prototype.range = function(offset){
	var returnArray = [];
	var start = offset ? 0+offset : 0;

	for(var i=start; i<this+start; i++){
		returnArray.push(i);
	}

	return returnArray;
}
