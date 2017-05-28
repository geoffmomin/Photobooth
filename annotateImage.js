var LIVE = true;
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// An object that gets stringified and sent to the API in the
// body of an HTTP request
requestObject = {
  "requests": [
    {
      "image": {
        "source": {"imageUri": "http://138.68.25.50:60401/hula.jpg"}
        },
      "features": [{ "type": "LABEL_DETECTION" }]
    }
  ]
}

// URL containing the API key
url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAmqOXA3nVIqiaoVcUzla4Y4PHK9M8yYOk';


function annotateImage() {
    if (LIVE) {
	// The code that makes a request to the API
	// Uses the Node request module, which packs up and sends off
	// an XMLHttpRequest.
	request(
	    { // HTTP header stuff
		url: url,
		method: "POST",
		headers: {"content-type": "application/json"},
		// stringifies object and puts into HTTP request body as JSON
		json: requestObject,
	    },
	    // callback function for API request
	    APIcallback
	);
    } else {  // not live! return fake response
	// call fake callback in 2 seconds
	console.log("not live");
	setTimeout(fakeAPIcallback, 2000);
    }
}


// live callback function
function APIcallback(err, APIresponse, body) {
    if ((err) || (APIresponse.statusCode != 200)) {
	console.log("Got API error");
    } else {
	APIresponseJSON = body.responses[0];
	console.log(APIresponseJSON);
    }
}

// fake callback function
function fakeAPIcallback() {
    console.log("fake");

	console.log( ` { labelAnnotations:    [ { mid: '/m/026bk', description: 'fakeLabel1', score: 0.89219457 },
     { mid: '/m/05qjc',
       description: 'fakeLabel2',
       score: 0.87477195 },
     { mid: '/m/06ntj', description: 'fakeLabel3', score: 0.7928342 },
     { mid: '/m/02jjt',
       description: 'fakeLabel4',
       score: 0.7739482 },
     { mid: '/m/02_5v2',
       description: 'fakeLabel5',
       score: 0.70231736 } ] }` );
}


// Comment out to make this a module:
annotateImage();

// Uncomment to make this a module:
// exports.annotateImage = annotateImage;
