/* This server, unlike our previous ones, uses the express framework */
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms a nd reading in the images

var sqlite3 = require("sqlite3").verbose();  // use sqlite
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);  // new object, old DB

var querystring = require('querystring'); // handy for parsing query strings

var LIVE = true;
var request2 = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// URL containing the API key
var apiKeyURL = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAmqOXA3nVIqiaoVcUzla4Y4PHK9M8yYOk';


//for db ops
function errorCallback(err) {
  if (err) {
    console.log("error: ", err, "\n");
  }
  else{
    console.log("db - op success");
  }
}

function dataCallback(err, tableData) {
  if (err) {
    console.log("error: ", err, "\n");
  }
  else {
    console.log("db - got: ", tableData, "\n");
  }
}
//for db ops


// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/query?img=hula"
app.get('/query', function (request, response){
  console.log("found a query");
  query = request.url.split("?")[1]; // get query string
  if (query) {
    answer(query, response);
  }
  else {
    sendCode(400,response,'query not recognized');
  }
}); //app.get()


// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
  var form = new formidable.IncomingForm();
  var fName; //filename of the pic we are uploading
  form.parse(request); // figures out what files are in form

  // callback for when a file begins to be processed
  form.on('fileBegin', function (name, file){
    //get filename to use it later
    fName = file.name;

    // put it in /public
    file.path = __dirname + '/public/' + file.name;
    console.log("uploading ", file.name, name);
  }); //form.on('fileBegin')

  // callback for when file is fully received
  form.on('end', function (){
    console.log('successfully uploaded ' + fName + ' to ./public');
    sendCode(201,response,'received file');  // respond to browser

    //DB STUFF START
    //should insert into db after we upload successfully to public
    console.log("db stuff");
    console.log("file is: " + fName);


    //TEST BEGIN
    var requestObject = {
       "requests":[
          {
             "image":{
                "source":{
                   "imageUri":"http://138.68.25.50:60401/hula.jpg"
                }
             },
             "features":[
                {
                   "type":"LABEL_DETECTION"
                }
             ]
          }
       ]
    }
    // s.requests[0].image.source.imageUri
    var imgUrl = "http://138.68.25.50:8650/" + fName;
    requestObject.requests[0].image.source.imageUri = imgUrl;

    function annotateImage(){
    if (LIVE){
      console.log("live");
      // Uses the Node request module, which packs up and sends off
      // The code that makes a request to the API
      // an XMLHttpRequest.

      request2(
      { // HTTP header stuff
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCed8rPNBMEB3hvgGLfgWpVgTPlT0ZX67M',
        method: "POST",
        headers: {"content-type": "application/json"},
        // stringifies object and puts into HTTP request body as JSON
        json: requestObject,
      },
      // callback function for API request
      APIcallback
      );
    }
    else {  // not live! return fake response
      // call fake callback in 2 seconds
      console.log("not live");
      setTimeout(fakeAPIcallback, 2000);
      }
    }

    // live callback function
    function APIcallback(err, APIresponse, body) {
      if ((err) || (APIresponse.statusCode != 200)) {
       console.log("Got API error");
      } //if
      else{
        APIresponseJSON = body.responses[0];
        console.log("response from google api for - " + fName);
        console.log(APIresponseJSON);

        var labels = "";
        for (i = 0; i < APIresponseJSON.labelAnnotations.length; i++){
          labels += (APIresponseJSON.labelAnnotations[i].description + ",");
        } //for
        labels = labels.slice(0, -1);
        //remove last char cuz it is a comma
        console.log("final labels from google is: " + labels);

        //update the db with new labels
        console.log("updating db with new labels");

        //insert into db - filename, labels, no favorite
        db.run('INSERT OR REPLACE INTO photoLabels VALUES (?, ?, 0)',
          [fName, labels], errorCallback);

      } //else
    } //apicallback()

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


    annotateImage();
    //TEST END



   //  //insert into db - filename, no labels, no favorite
   //  db.run(
  	// 'INSERT OR REPLACE INTO photoLabels VALUES (?, "", 0)',
  	// [fName], errorCallback);
   //  //DB STUFF END

  }); //form.on('end')
  //finished uploading to public

}); //post()

// You know what this is, right?
var port = 8650;
app.listen(port);
console.log ("listening to port: " + port);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
  response.status(code);
  response.send(message);
}

// Stuff for dummy query answering
// We'll replace this with a real database someday!
function answer(query, response) {
  console.log("answering query");

  queryObj = querystring.parse(query);
  console.log(queryObj);

  //if we just started the page - get all files in db
  if (queryObj.op == "dump"){
    // Dump whole database
    console.log("dump op detected - must be starting the page");

    function dbAllRet(err, tableData){
      if (err) {
        console.log("error: ", err, "\n");
      }
      else {
        response.status(200);
        response.type("application/json");
        JSON.stringify(tableData);
        response.send(tableData);
        console.log("sent dbAll to client");
      }
    } //dbAllRet()
    db.all('SELECT * FROM photoLabels', dbAllRet);
    //callback will return the json string
  } //if op == dump

  //else if we are getting the gets for a picture in db
  else if (queryObj.op == "getTags"){
    var fileName = queryObj.fileName;
    console.log("query is getTags - file is " + fileName);

    function dbTagsRet(err, tableData){
      if (err) {
        console.log("error: ", err, "\n");
      }
      else {
        response.status(200);
        response.type("application/json");
        JSON.stringify(tableData);
        response.send(tableData);
        console.log("sent db tags to client");
      }
    } //dbTagsRet()
    db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [fileName], dbTagsRet);
    //callback will return the json string
  } //else if op == getTags

  else if (queryObj.op == "updateTags"){
    console.log("query is updateTags and filename is - " + queryObj.fileName);
    var filename = queryObj.fileName;
    var newTags = queryObj.newTags;

    db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ?', [newTags, filename], errorCallback);
  } //else if op == updateTags

  else if (queryObj.op == "favorite"){
    console.log("query is favorite and filename is - " + queryObj.fileName);
    var filename = queryObj.fileName;

    db.run('UPDATE photoLabels SET favorite = 1 WHERE fileName = ?', [filename], errorCallback);
    // update photolabels set favorite = 1 where filename = "pupper.jpg";

  } //else if op == favorite

  else if (queryObj.op == "getFavorites"){
    console.log("query is getFavorites");

    function dbGetFavsRet(err, tableData){
      if (err) {
        console.log("error: ", err, "\n");
      }
      else {
        response.status(200);
        response.type("application/json");
        JSON.stringify(tableData);
        response.send(tableData);
        console.log("sent dbAll to client");
      }
    }//callback()
    db.all("SELECT * from photolabels WHERE favorite = 1", dbGetFavsRet);
  } //else if op == getFavorites

  else if (queryObj.op == "getFilter"){
    console.log('query is getFilter and filter is - ' + queryObj.filter);
    var filter = queryObj.filter;

    function dbGetFilterRet(err, tableData){
      if (err) {
        console.log("error: ", err, "\n");
      }
      else {
        response.status(200);
        response.type("application/json");
        JSON.stringify(tableData);
        response.send(tableData);
        console.log("sent dbAll to client");
      }
    }//callback()

    const sql = 'SELECT * from photolabels WHERE labels LIKE $filter';
    const params = {$filter: '%' + filter + '%'};
    db.all(sql, params, dbGetFilterRet);
    // db.all("SELECT * from photolabels where labels LIKE '%?%'", [filter], dbGetFilterRet);
  } //else if op == getFilter

} //answer()

// get all labels that contain the string "cat"
// SELECT * from photolabels  WHERE labels LIKE '%cat%';

// get all labels that have favorite = 1
// SELECT * from photolabels  WHERE favorite = 1;
