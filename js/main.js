// IDENTIFY ELEMENTS AND SET VARIABLES
var banner = $("#banner-message")
var buttonFindMatch = $("#findMatchButton")
var buttonLoadSvg = $("#loadSvg")
var input = $("input")
var text = $("#text")
var $previewSvgDiv = $("#uploadedSvg")
var $modifiedSvgDiv = $("#modifiedSvg")
var inputcolour = [];
var comparisoncolours = [];
var $svgTextarea = $( "#inputSvg" )
var modifiedSVG;

// REGISTER HANDLERS
buttonFindMatch.on("click", () => {
 printColourMatchResults($("input").val());
})

buttonLoadSvg.on("click", () => {
    previewSVG();
})

$( "#buttonLoadExample" ).on("click", () => {
    loadSVGExample("example.svg");
})

$( "#buttonLoadExample2" ).on("click", () => {
    loadSVGExample("example2.svg");
})

$( "#buttonLoadExample3" ).on("click", () => {
    loadSVGExample("example3.svg");
})

$( "#buttonLoadAny" ).on("click", () => {
    loadLocalFile();
})

$( "#hoverToCompare" )
  .on( "mouseenter", function() {
    $modifiedSvgDiv.html( $previewSvgDiv.html() );
  })
  .on( "mouseleave", function() {
    $modifiedSvgDiv.html( modifiedSVG );
  });

$( "#setPalette1" ).on("click", () => {
    $.ajax({
        type: "GET",
        url: "data.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
})

$( "#setPalette2" ).on("click", () => {
    $.ajax({
        type: "GET",
        url: "data2.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
})

// FUNCTIONS TO PERFORM ON LOAD
$( document ).ready(function() {
	    $.ajax({
        type: "GET",
        url: "data.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

// FUNCTIONS

function loadLocalFile() {
    var input = $('#fileinput');
          
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   
  
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.prop("files")) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.prop("files")[0]) {
      alert("Please select a file before clicking 'Load'");               
    }
    else if (input.prop("files")[0].type != "image/svg+xml") {
      alert("Please select an SVG file");               
    }
    else {
      var file = input.prop("files")[0];
      var fr = new FileReader();
      fr.onload = function receivedText() {
        $svgTextarea.val(fr.result);
      }  ;
      fr.readAsText(file);
      //fr.readAsBinaryString(file); //as bit work with base64 for example upload to server
      // fr.readAsDataURL(file);
    } 
}

function previewSVG() {
    var svg = $svgTextarea.val();
    $previewSvgDiv.html( svg );
    $modifiedSvgDiv.html( svg );

    var allFills = $( $modifiedSvgDiv ).find( "path[fill]" );
    console.log(allFills.length);
    loopThroughFillsAndSetColours(allFills);
}

function loadSVGExample(filename) {
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        success: function(data) {setExampleSVGintoTextarea(data);}
     });
}

function setExampleSVGintoTextarea(svg) {
    $svgTextarea.val( svg );
}

function loopThroughFillsAndSetColours(allFills) {
    $( "#replacementResult" ).empty();
    for (var i = 0; i < allFills.length; i++) {
        var originalColourHex = $( allFills[i] ).attr("fill");

        // If a four-character hexcolor like #FFF, make seven-character
        if (originalColourHex.length === 4) {
            originalColourHex = originalColourHex.split('').map(function (hex) {
                if (hex=="#") {
                    return hex
                } else {
                    return hex + hex;
                }
            }).join('');
        }

        var closestMatch = findMatch(originalColourHex);
        $( allFills[i] ).attr("fill",closestMatch[0].hex);
        $( "#replacementResult" ).append(originalColourHex + " was replaced with " + closestMatch[0].name + "<br>");
    }
    modifiedSVG = $modifiedSvgDiv.html();
}


function findMatch(hex) { 
	// turn hex to rgb
	var inputRGB = hexToRGB(hex);
	// compare against each

	for (var i = 0; i < comparisoncolours.length; i++) {
	  comparisoncolours[i].diff = colorDifference(inputRGB[0],inputRGB[1],inputRGB[2],comparisoncolours[i].red,comparisoncolours[i].green,comparisoncolours[i].blue);
	}

    // sort colours by diff
    var sortedColours = comparisoncolours;
    sortedColours.sort(function(a, b){return a.diff - b.diff});

    // add a hex key
    for (var i = 0; i < sortedColours.length; i++) {
        sortedColours[i].hex = rgbToHex(sortedColours[i].red,sortedColours[i].green,sortedColours[i].blue);
    }

    return sortedColours;
}

function printColourMatchResults(hex) {
    var inputRGB = hexToRGB(hex);
    var sortedColours = findMatch(hex);

    // output result
    $("#square").css("background-color","rgb("+sortedColours[0].red+","+sortedColours[0].green+","+sortedColours[0].blue+")");
    text.text(sortedColours[0].name + " diff: " + sortedColours[0].diff.toFixed(2));
    
    $("#side1").css("background-color","rgb("+inputRGB[0]+","+inputRGB[1]+","+inputRGB[2]+")");
    $("#side2").css("background-color","rgb("+sortedColours[0].red+","+sortedColours[0].green+","+sortedColours[0].blue+")");

    $("#alternatives").empty();
    $("#alternatives").append("<br>Next 4 closest matching colours found:<br>");
    for (var i = 1; i < 5; i++) {
        var square = "<div style='background-color:rgb" + "(" + sortedColours[i].red + "," + sortedColours[i].green + "," + sortedColours[i].blue + "); width:10px; height:10px; display:inline-block;'></div>"
        $("#alternatives").append(square + " " + sortedColours[i].name + " (" + sortedColours[i].red + "," + sortedColours[i].green + "," + sortedColours[i].blue + " diff: " + sortedColours[i].diff.toFixed(2) + ")<br>");
    }
}

function colorDifference (r1, g1, b1, r2, g2, b2) {
    var sumOfSquares = 0;

    sumOfSquares += Math.pow(r1 - r2, 2);
    sumOfSquares += Math.pow(g1 - g2, 2);
    sumOfSquares += Math.pow(b1 - b2, 2);
    
    return Math.sqrt(sumOfSquares);
//			return sumOfSquares;
}

//Function to convert Hex value to RGB value
function hexToRGB (hex){
    //Break the hex value up into pairs in an array
    let hexArray =[];
    let sliceIndex=0;
    //Remove the # from the front of the hex value for conversion
    hex = hex.substring(1);
    //Break the hex value into pairs for conversion and store in an array
    for (let i=0;i<3;i++){
      hexArray.push(hex.slice(sliceIndex,sliceIndex+2));
      sliceIndex = sliceIndex + 2;
    }
    //Convert Hex Values to RGB Values
    let rgbArray=[];
    for (let i=0;i<3;i++){
      let rgbValue = parseInt(hexArray[i],16);
      rgbArray.push(rgbValue);
    }  
    return rgbArray;
//    return "rgb("+rgbArray[0] + ", " + rgbArray[1] + ", " + rgbArray[2]+")";
  };

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function listallcolours() {
    $("#allcolours").empty();
  for (var i = 0; i < comparisoncolours.length; i++) {
    var square = "<div style='background-color:rgb" + "(" + comparisoncolours[i].red + "," + comparisoncolours[i].green + "," + comparisoncolours[i].blue + "); width:10px; height:10px; display:inline-block;'></div>"
    $("#allcolours").append(square + " " + comparisoncolours[i].name + " (" + comparisoncolours[i].red + "," + comparisoncolours[i].green + "," + comparisoncolours[i].blue + ")<br>");
  }
}

function isColor(strColor){
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}


function processData(data) {
    comparisoncolours = [];
    var allRows = data.split(/\r\n|\n/);
    var headers = allRows[0].split(',');
    var allColumns = [];

    for (var i=1; i<allRows.length; i++) {
        var data = allRows[i].split(',');
        if (data.length == headers.length) {
            // allColumns.push(data);
            var rgb = hexToRGB(data[1])
            var obj = {red:rgb[0],green:rgb[1],blue:rgb[2],name:data[0]}
            comparisoncolours.push(obj);
//            comparisoncolours.push([rgb[0],rgb[1],rgb[2],data[0]]);
        }
    }
        listallcolours();
}