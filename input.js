/******************
 * @author Hampton Brewer
 * CS 457 DB Final Project
 * 12/9/2015
 * Info: Javascript file that reads from the 
 * 		 input.txt file and places it's values
 * 		 into the database
 */
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var dbCS457 = [];

reader.open('get', 'input.txt', true); 
reader.onreadystatechange = getDatabaseInfo;
reader.send(null);

function getDatabaseInfo() {
    if(reader.readyState==4) {
		var dbLineParsedArray = reader.responseText.split('\n');
		for(var i=0; i<dbLineParsedArray.length; i++){
			createDataArrayObjects(i,dbLineParsedArray[i]);
		}
    }
}

function createDataArrayObjects(vID,fieldData){
	var div = document.getElementById(vID);
	fieldData = fieldData.trim();
	var fieldVars = fieldData.replace(/:/g,'').split(/[\s,]+/);
	var valueID = vID + 1; //increment id to account for array=0
	
	for(var j=0; j<fieldVars.length; j+=2){
		dbCS457.push({
			ID: valueID,
			name:fieldVars[j],
			value:fieldVars[j+1]
		})
	
	}
	//div.innerHTML = fieldVars;
}