/******************
 * @author Hampton Brewer
 * CS 457 DB Final Project
 * 12/9/2015
 * Info: Main Javascript File called by database.html
 * 		 This File runs the events and user input. It
 * 		 also processes the query input to output answers.
 */

var finalOutput = '';
var conditions = false;
var fields = false;
var recentInputs = [];
var recentInputsCurrentNum = 0;
var followInput = 0;
$(document).ready(function(){
	$("body").keydown(function(e){
		if(e.keyCode==13){
			e.preventDefault();
			var input = document.getElementById("inputArea").value;
			recentInputs.push(input);
			recentInputsCurrentNum++;
			followInput = recentInputsCurrentNum;
			originalInput = input;
			finalOutput = originalInput + '<br>' + '--------Results---------';
			if(input != ''){
				splitInput(input); //added semicolon?
				/*if(splitInput(input)){
					var div = document.getElementById('textWindow');
					div.innerHTML = div.innerHTML + input + '<br><br>';
					div.scrollTop = div.scrollHeight;
					document.getElementById("inputArea").value = "";
				}*/
			}
		}
		if(e.keyCode==38){ //up
			e.preventDefault();
			document.getElementById("inputArea").value = recentInputs[followInput-1];
			if(followInput > 1){
				followInput--;
			}
		}
		if(e.keyCode==40){ //down
			e.preventDefault();
			document.getElementById("inputArea").value = recentInputs[followInput-1];
			if(followInput < recentInputsCurrentNum){
				followInput++;
			}
		}
	})
});

//clears the textWindow
function clearWindow(){
	var div = document.getElementById('textWindow');
	div.innerHTML = '';
}
function error(expected,found){
	var div = document.getElementById("error");
	div.innerHTML = "Expected:" + expected + "<br>" + "Found:"+ found;
}

function splitInput(input){
	var inputArray = input.split(".");
	//creates an array of the input
	for(var i=0; i<inputArray.length;i++){ 
		switch(i){
			case 0:if(inputArray[i] != 'db'){ error('db', inputArray[i]); return false;} else{continue;}
			case 1:if(inputArray[i] != 'CS457'){ error('CS457', inputArray[i]); return false;}else{continue;}
			case 2: processQueries(inputArray[2]);break;			
		}
	}
}


function processQueries(queries){
	//var operationSplit = queries.split(')');
	//var operation = operationSplit[0].split('(');
	var operation = queries.split('(');
	var passed = false;
	if(operation.length > 0){
		switch(operation[0]){
			case "query": query(operation); passed=true; break;
			case "sum": sum(operation); passed=true; break;
			case "max": max(operation); passed=true; break;
			case "avg": avg(operation); passed=true; break;
			case "cartprod": cartprod(operation); passed=true; break;
		}
	}
	if(!passed){
		error('A Correct Operation', operation[0]);	
	}
}

function query(operation){  //operation = [query][Age > 15 and Manager = 555, SNum+Dept]
	for(var i=0; i<operation.length; i++){
		if(i==1){
			var conditionFieldString = operation[i].split(')',1);
			if(conditionFieldString.length > 0){
					var commaValue = conditionFieldString[0].search(',');
					
					var conditionFieldFinal = conditionFieldString[0];
			}
			//var queryVars = operation[i].split(',');
			//var conditions = queryVars[0].split('and');
			//var getFields = queryVars[1].split('+');
			if(commaValue == -1){ //no comma found only run conditions if there are any
				if(conditionFieldFinal == ''){
					printAll();
				}
				else{
					conditions = true;
					finalSplitting(' and',conditionFieldFinal);
				}
			}
			else if(commaValue == 0){
					fields = true;
					finalSplitting('+',conditionFieldFinal);
				}
			else if(commaValue > 0){
				fields = true;
				conditions = true;
				finalSplittingTogether(conditionFieldFinal);
				//var div = document.getElementById("error");
				//div.innerHTML = "QUEEREY PROCESSED: " + conditionFieldFinal;
				//var div = document.getElementById('4');
				//div.innerHTML = dbCS457[0].name;
				
				}
			
		}
	}	
}


function printAll(){
	var currentID = 1;
	var needsBreak = true;
	var acceptID = false;
	for(var j=0; j<dbCS457.length; j++){
		if(dbCS457[j].ID != currentID){
			needsBreak = true;
			currentID++;
		}
		if(needsBreak){
			finalOutput+= '<br>';
			needsBreak = false;
			acceptID = false;
		}
		if(!acceptID){
			finalOutput += 'ID: ' + dbCS457[j].ID + ' ';
			acceptID = true;
		}
		if(dbCS457[j].ID == currentID){
			finalOutput+= dbCS457[j].name + ': ' + dbCS457[j].value + ' ';
		}
		
	}
	finalOutput += '<br>' + '-----------End-----------';
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";
	var div = document.getElementById("error");
	div.innerHTML = '';
}
//if there are both conditions and fields
function finalSplittingTogether(queryString){
	//queryString = returnAsStringSplit(' ',queryString);
	queryString = queryString.split(',');
	var conditionValues;
	var fieldValues;
	var IDList = [];
	for(var i=0; i<queryString.length; i++){
		if(i==0){
			conditionValues = queryString[i];
		}
		if(i==1){
			fieldValues = queryString[i];
		}
	}
	
	conditionValues = conditionValues.split(' and ');
	for(var i=0; i<conditionValues.length; i++){
		conditionValues[i] = returnAsStringSplit(' ',conditionValues[i]);
	}
	var conditionNumber = conditionValues.length;
	//conditionValues = returnAsStringSplit(' ',conditionValues);
	var splitCondition;
	var test;
	for(var i=0; i<conditionNumber; i++){
		//var ensureNumber = Number(conditionNumber);
		if(conditionValues[i].search('>') != -1){
			splitCondition = conditionValues[i].split('>');
			for(var j=0; j<dbCS457.length; j++){
				if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value > Number(splitCondition[1])){
					IDList.push(dbCS457[j].ID);
				}
				if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value < Number(splitCondition[0])){
					IDList.push(dbCS457[j].ID);
				}
			}
		}
		if(conditionValues[i].search('<') != -1){
			splitCondition = conditionValues[i].split('<');
			for(var j=0; j<dbCS457.length; j++){
				if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value < Number(splitCondition[1])){
					IDList.push(dbCS457[j].ID);
				}
				else if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value > Number(splitCondition[0])){
					IDList.push(dbCS457[j].ID);
				}
			}
		}
		if(conditionValues[i].search('=') != -1){
			splitCondition = conditionValues[i].split('=');
			for(var j=0; j<dbCS457.length; j++){
				if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value == Number(splitCondition[1])){
					IDList.push(dbCS457[j].ID);
				}
				else if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value == Number(splitCondition[0])){
					IDList.push(dbCS457[j].ID);
				}
			}
		}
	}
	
	var countIDList = [];
	for(var i=0; i<dbCS457.length; i++){ 
		countIDList[i] = 0;
	}
	for(var i=0; i<IDList.length; i++){
		var hold = IDList[i];
		countIDList[hold-1] += 1;
	}
	
	//GET FIELD VALUES
	var isItID = false;
	fieldValues = fieldValues.split('+');
	if(fieldValues.length > 0){
		for(var i=0; i<fieldValues.length; i++){
			fieldValues[i] = returnAsStringSplit(' ',fieldValues[i]);
			if(fieldValues[i] == 'ID'){
				isItID = true;
			}
		}
		//var holdit = returnAsStringSplit(' ',fieldValues[0]);

	}
	
	for(var i=0; i<countIDList.length; i++){
		if(countIDList[i] >= conditionNumber){
			var needsBreak = true;
			for(var m=0; m<fieldValues.length; m++){
				if(fieldValues[m] == 'ID'){
					var x = i+1;
					finalOutput += '<br>ID: ' + x + ' ';
					needsBreak = false;
				}
			}
			for(var j=0; j<dbCS457.length; j++){
				
				if(dbCS457[j].ID == i+1){ //inc for ID
					
						//if(needsBreak){
						//	finalOutput += '<br>';
						//	needsBreak = false;
						//}
						for(var k=0; k<fieldValues.length; k++){
							if(dbCS457[j].name == fieldValues[k]){
								if(needsBreak){
									finalOutput += '<br>';
									needsBreak = false;
								}
								finalOutput += dbCS457[j].name + ': ' + dbCS457[j].value + ' ';
							}
						}
						//needsBreak = false;
					
				}
			}
		}
	}
	
	
	
	finalOutput += '<br>' + '-----------End-----------';
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";
	finalOutput = '';
	conditions = false;
	fields = false;	
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED: " + finalOutput;
	var div = document.getElementById("error");
	div.innerHTML = '';
}

function returnAsStringSplit(splitBy,stringInput){
	Array = stringInput.split(splitBy);
	var holdString = '';
	for (var i=0; i<Array.length; i++){
		holdString += Array[i];
	}
	return holdString;
}

function finalSplitting(splitValue,conditionFieldFinal){
	var IDList = [];
	var conditionValues;
	if(splitValue == ' and' && conditions){
		
		conditionValues = conditionFieldFinal.split(' and ');
		for(var i=0; i<conditionValues.length; i++){
			conditionValues[i] = returnAsStringSplit(' ',conditionValues[i]);
		}
		var conditionNumber = conditionValues.length;
		//conditionValues = returnAsStringSplit(' ',conditionValues);
		var splitCondition;
		var test;
		for(var i=0; i<conditionNumber; i++){
			//var ensureNumber = Number(conditionNumber);
			if(conditionValues[i].search('>') != -1){
				splitCondition = conditionValues[i].split('>');
				for(var j=0; j<dbCS457.length; j++){
					if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value > Number(splitCondition[1])){
						IDList.push(dbCS457[j].ID);
					}
					if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value < Number(splitCondition[0])){
						IDList.push(dbCS457[j].ID);
					}
				}
			}
			if(conditionValues[i].search('<') != -1){
				splitCondition = conditionValues[i].split('<');
				for(var j=0; j<dbCS457.length; j++){
					if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value < Number(splitCondition[1])){
						IDList.push(dbCS457[j].ID);
					}
					if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value > Number(splitCondition[0])){
						IDList.push(dbCS457[j].ID);
					}
				}
			}
			if(conditionValues[i].search('=') != -1){
				splitCondition = conditionValues[i].split('=');
				for(var j=0; j<dbCS457.length; j++){
					if(dbCS457[j].name == splitCondition[0] && dbCS457[j].value == Number(splitCondition[1])){
						IDList.push(dbCS457[j].ID);
					}
					if(dbCS457[j].name == splitCondition[1] && dbCS457[j].value == Number(splitCondition[0])){
						IDList.push(dbCS457[j].ID);
					}
				}
			}
		}
	}

	
	
	//if(splitValue == 'both' && conditions && fields){
	//	var gotit = 'hello'; 
		//Age > 15,Manager
		//split them by the comma [0] = Age > 15 and  [1] = Manager+Age
	//}
	
	
	var countIDList = [];
	for(var i=0; i<dbCS457.length; i++){ 
		countIDList[i] = 0;
	}
	for(var i=0; i<IDList.length; i++){
		var hold = IDList[i];
		countIDList[hold-1] += 1;
	}
	
	//used only if just fields are asked for
	if(splitValue == '+' && !conditions && fields){
		var conditionNumber = 0;
		//conditionFieldFinal = conditionFieldFinal.split(' ');
		var holdString = returnAsStringSplit(' ', conditionFieldFinal);
		holdString = holdString.replace(/,/g,'');
		var fieldFinalArray = holdString.split(splitValue);
		var acceptID = false;
		var needsBreak = true;
		
		var currentID = 1;
		for(var j=0; j<dbCS457.length; j++){
			for(var k=0; k<fieldFinalArray.length; k++){
				if(dbCS457[j].ID != currentID){
					needsBreak = true;
					acceptID = false;
					currentID++;
				}
				if(dbCS457[j].ID == currentID){
					if(fieldFinalArray[k] == 'ID' && !acceptID){
						if(needsBreak){
							finalOutput += '<br>';
							needsBreak = false;
						}
						acceptID = true;
						var x = currentID;
						finalOutput += 'ID: ' + x + ' ';
					}
					if(dbCS457[j].name == fieldFinalArray[k]){
						if(needsBreak){
							finalOutput += '<br>';
							needsBreak = false;
						}
						finalOutput += dbCS457[j].name + ': ' + dbCS457[j].value + ' ';
					}
				}
			}
		}
	}
	
	
		//gets the list of correct values, only if just conditions asked
	if(conditions && !fields){
		
		var tempString = ' ';
		var currentID = 1;
		for(var i=0; i<countIDList.length; i++){
			if(countIDList[i] >= conditionNumber){
				var acceptID = false;
				var needsBreak = true;
				for(var j=0; j<dbCS457.length; j++){
					if(dbCS457[j].ID == i+1){ //inc for ID
						if(needsBreak){
							finalOutput += '<br>';
						}
						if(!acceptID){
							var x = i+1;
							finalOutput += 'ID: ' + x + ' ';
							acceptID = true;
						}
						finalOutput += dbCS457[j].name + ': ' + dbCS457[j].value + ' ';
						needsBreak = false;
					}
					else{
					}
				}
			}
		}
	}
	
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED2: " + finalOutput;
	//finalOutput += '<br>' + countIDList;
    finalOutput += '<br>' + '-----------End-----------';
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";
	var div = document.getElementById("error");
	div.innerHTML = '';
	finalOutput = '';
	conditions = false;
	fields = false;
}

function sum(operation){
	for(var i=1; i<operation.length; i++){
		var getSumString = operation[i].replace(')','');
	}
	getSumString = returnAsStringSplit(' ',getSumString);
	var foundValue = false;
	var getSum = 0;
	for(var i=0; i<dbCS457.length; i++){
		if(dbCS457[i].name == getSumString){
			getSum += Number(dbCS457[i].value); 
			var foundValue = true;
		}
	}
	if(!foundValue){
		finalOutput += '<br>' +  '-----------End-----------';	
	}
	else{
		finalOutput += '<br>' + getSum + '<br>' + '-----------End-----------';	
	}
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED: " + finalOutput;
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";
	var div = document.getElementById("error");
	div.innerHTML = '';
	finalOutput = '';
	conditions = false;
	fields = false;
}

function max(operation){
	for(var i=1; i<operation.length; i++){
		var getMaxString = operation[i].replace(')','');
	}
	getMaxString = returnAsStringSplit(' ',getMaxString);
	var foundValue = false;
	var getMax = 0;
	for(var i=0; i<dbCS457.length; i++){
		if(dbCS457[i].name == getMaxString){
			var holdNum = Number(dbCS457[i].value);
			if(getMax < holdNum){
				getMax = holdNum; 	
			}
			foundValue = true;
		}
	}
	if(!foundValue){
		finalOutput += '<br>' +  '-----------End-----------';	
	}
	else{
		finalOutput += '<br>' + getMax + '<br>' + '-----------End-----------';	
	}
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED: " + finalOutput;
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";	
	var div = document.getElementById("error");
	div.innerHTML = '';
	finalOutput = '';
	conditions = false;
	fields = false;
}

function avg(operation){
	for(var i=1; i<operation.length; i++){
		var getAvgString = operation[i].replace(')','');
	}
	getAvgString = returnAsStringSplit(' ',getAvgString);
	var foundValue = false;
	var getAvg = 0;
	var avgCount = 0;
	for(var i=0; i<dbCS457.length; i++){
		if(dbCS457[i].name == getAvgString){
			getAvg += Number(dbCS457[i].value); 
			var foundValue = true;
			avgCount++;
		}
	}
	if(!foundValue){
		finalOutput += '<br>' +  '-----------End-----------';	
	}
	else{
		getAvg = (getAvg/avgCount);
		finalOutput += '<br>' + getAvg + '<br>' + '-----------End-----------';	
	}
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED: " + operation;
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";	
	var div = document.getElementById("error");
	div.innerHTML = '';
	finalOutput = '';
	conditions = false;
	fields = false;	
}

function cartprod(operation){
	for(var i=1; i<operation.length; i++){
		var getCartprodString = operation[i].replace(')','');
	}
	//getAvgString = getAvgString.replace(' ','');
	getCartprodString = returnAsStringSplit(' ',getCartprodString);
	getCartprodString = getCartprodString.split(',');
	
	var searchID = false;
	var foundID = -1;
	for(var j=0; j<getCartprodString.length; j++){
		if(getCartprodString[j] == 'ID'){
			searchID = true;
		}
	}
	if(!searchID){
		for(var i=0; i<dbCS457.length; i++){
			
			for(var j=0; j<getCartprodString.length-1; j++){
				
				if(dbCS457[i].name == getCartprodString[j]){
					
					for(var k=0; k<dbCS457.length; k++){
						
						if(dbCS457[k].name == getCartprodString[j+1]){
							finalOutput += '<br>' + dbCS457[i].name.toUpperCase() + ': ' + dbCS457[i].value + ' ' + dbCS457[k].name + ': ' + dbCS457[k].value;
							//finalOutput += dbCS457[i].name + ': ' + dbCS457[i].value + ' ' dbCS457[k].name + ': ' + dbCS457[k].value + '<br>'; 
						}
					}
				}
			}
		}
	}
	else{
		for(var i=0; i<dbCS457.length; i++){
			for(var j=0; j<getCartprodString.length; j++){
				if(getCartprodString[j] == 'ID'){
					foundID = j;		
				}
			}	
		}
		if(foundID == 0){
			for(var i=0; i<dbCS457.length; i++){
				
				for(var j=0; j<getCartprodString.length-1; j++){
					
					//if('ID' == getCartprodString[j]){
						
						for(var k=0; k<dbCS457.length; k++){
							if(dbCS457[k].name == getCartprodString[j+1]){
								finalOutput += '<br>' + 'ID: ' + dbCS457[i].ID + ' ' + dbCS457[k].name + ': ' + dbCS457[k].value;
								//finalOutput += dbCS457[i].name + ': ' + dbCS457[i].value + ' ' dbCS457[k].name + ': ' + dbCS457[k].value + '<br>'; 
							}
						}
					//}
				}
			}
		}
		if(foundID == 1){
			for(var i=0; i<dbCS457.length; i++){
				
				for(var j=0; j<getCartprodString.length-1; j++){
					
					//if('ID' == getCartprodString[j]){
						
						for(var k=0; k<dbCS457.length; k++){
							if(dbCS457[k].name == getCartprodString[j]){
								finalOutput += '<br>' + dbCS457[k].name.toUpperCase() + ': ' + dbCS457[k].value+ ' ID: ' + dbCS457[i].ID;
								//finalOutput += dbCS457[i].name + ': ' + dbCS457[i].value + ' ' dbCS457[k].name + ': ' + dbCS457[k].value + '<br>'; 
							}
						}
					//}
				}
			}
		}
	}	
	
	//var div = document.getElementById("error");
	//div.innerHTML = "QUEEREY PROCESSED: " + finalOutput;
	var div = document.getElementById('textWindow');
	div.innerHTML = div.innerHTML + finalOutput + '<br>-----------End-----------' + '<br><br>';
	div.scrollTop = div.scrollHeight;
	document.getElementById("inputArea").value = "";
	var div = document.getElementById("error");
	div.innerHTML = '';
	finalOutput = '';
	conditions = false;
	fields = false;	
}
