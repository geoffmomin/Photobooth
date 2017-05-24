var port = 8650;
var mainUrl = "http://138.68.25.50:" + port;
//https://138.68.25.50:xxxx

var favoritesHolder = document.getElementById("favoritesHolder").style;
var filterHolder = document.getElementById("filterHolder").style;
var uploadHolder = document.getElementById("uploadHolder").style;

var favoritesClass = document.getElementById("favoritesDropdown").classList;
var filterClass = document.getElementById("filterDropdown").classList;
var uploadClass = document.getElementById("uploadDropdown").classList;

function toggleUpload(){
      uploadClass.toggle("show");
      if(filterClass.contains('show')){
        filterClass.toggle("show");
        filterHolder.position = "relative";
        filterHolder.top = "0px";
      }

      if(favoritesClass.contains('show')){
        favoritesClass.toggle("show");
        favoritesHolder.position = "relative";
        favoritesHolder.top = "0px";
      }

      if(uploadClass.contains('show')){
       favoritesHolder.position = "relative";
       favoritesHolder.top = "130px";
       filterHolder.position = "relative";
       filterHolder.top = "130px";
     }

     else{
      favoritesHolder.position = "relative";
      favoritesHolder.top = "0px";
      filterHolder.position = "relative";
      filterHolder.top = "0px";
     }
}

function toggleFilter() {
      filterClass.toggle("show");
      if(uploadClass.contains('show')){
        uploadClass.toggle("show");
        filterHolder.position = "relative";
        filterHolder.top = "0px";
      }

      if(favoritesClass.contains('show')){
        favoritesClass.toggle("show");
        favoritesHolder.position = "relative";
        favoritesHolder.top = "0px";
      }

    if(filterClass.contains('show')){
       favoritesHolder.position = "relative";
       favoritesHolder.top = "130px";
     }

     else{
      favoritesHolder.position = "relative";
      favoritesHolder.top = "0px";
     }
}

function toggleFavorites() {
      favoritesClass.toggle("show");
      if(uploadClass.contains('show')){
        uploadClass.toggle("show");
        filterHolder.position = "relative";
        filterHolder.top = "0px";
        favoritesHolder.position = "relative";
        favoritesHolder.top = "0px";
      }

      if(filterClass.contains('show')){
        filterClass.toggle("show");
        filterHolder.position = "relative";
        filterHolder.top = "0px";
        favoritesHolder.position = "relative";
        favoritesHolder.top = "0px";
      }

}

window.onload=function(){
  console.log('onLoad function');
  //want to get all things in the db
    // query looks liek this - 138.68.25.50:1935/query?img=hula.jpg
  var url = mainUrl + "/query?op=dump";

  function reqListener () {
    //this.response contains json/ARRAY?? of all files in db
    console.log("dbAll received");
    console.log(this.response);
    var dbData = JSON.parse(this.response);

    //should display these items.
      //TESTTTT START

      //fun for each item in db
    for (i = 0; i < dbData.length; i++){
      var template = document.getElementById('pictureContainer0');
      clone = template.cloneNode(true); // true means clone all childNodes and all event handlers
      //clone's id will be picContainer + 1...n
      clone.id = "pictureContainer" + i + 1;

      // http://138.68.25.50:8650/cat.jpg
      clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;


      var tagArray = clone.getElementsByClassName("testTag");
      //10 tags in html

      var dbTags = dbData[i].labels.split(",")
      //tags from db

      for (j = 0; j < dbTags.length; j++){
        tagArray[j].innerText = dbTags[j];
      }

      //add the container into pictures container
      document.getElementById("pictures").appendChild(clone);
    }

    //remove the template
    document.getElementById('pictureContainer0').style.visibility = "hidden";

      //TESTTTT END




      //TEST COMMENT START
    // //if there is nothing in db, display nothing
    // if (dbData.length == 0){
    //   document.getElementById("pictureContainer0").style.visibiliety = "hidden";
    // }
    //
    // //there is 1 or more stuff in db.
    // else{
    //   document.getElementById("pictureContainer0").style.visibiliety = "visible";
    //
    //   for (i = 0; i < dbData.length; i++){
    //     //if it's the first div
    //     if (i == 0){
    //       var target = document.getElementById('pictureContainer0');
    //       target.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;
    //
    //       var tagArray = target.getElementsByClassName("testTag");
    //       //10 tags in html
    //
    //       var dbTags = dbData[i].labels.split(",")
    //       //tags from db
    //
    //       for (j = 0; j < dbTags.length; j++){
    //         tagArray[j].innerText = dbTags[j];
    //       }
    //     } //if
    //
    //     //else not 1st div
    //     else{
    //       var target = document.getElementById('pictureContainer0');
    //       clone = target.cloneNode(true); // true means clone all childNodes and all event handlers
    //       //clone's id will be picContainer + 1...n
    //       clone.id = "pictureContainer" + i;
    //
    //       // http://138.68.25.50:8650/cat.jpg
    //       clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;
    //
    //       var tagArray = target.getElementsByClassName("testTag");
    //       //10 tags in html
    //
    //       var dbTags = dbData[i].labels.split(",")
    //       //tags from db
    //
    //       for (j = 0; j < dbTags.length; j++){
    //         tagArray[j].innerText = dbTags[j];
    //       }
    //
    //       //add the container into pictures container
    //       document.getElementById("pictures").appendChild(clone);
    //     } //else not 1st div
    //   } //for db.length
    // } //else there is 1 or more stuff in db

      //TEST COMMENT END

  } //reqListener()

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url);
  oReq.send();
  console.log("asked for dbAll");

} //window.onload()


// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var favoritesHolder = document.getElementById("favoritesHolder").style;
  var filterHolder = document.getElementById("filterHolder").style;


    if(!event.target.matches('.dropbtn')){
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      favoritesHolder.position = "relative";
      favoritesHolder.top = "0px";
      filterHolder.position = "relative";
      filterHolder.top = "0px";
  }
} //window.onclick

function myFunction() {
    document.getElementById("picMenuDropDown").classList.toggle("show");
}


function readFile() {
  var selectedFile = document.getElementById('fileSelector').files[0];
  var image = document.getElementById('loadingImage0');

  var fr = new FileReader();
  // anonymous callback uses file as image source
  fr.onload = function () {
     image.src = fr.result;
  };
  fr.readAsDataURL(selectedFile);    // begin reading
  // make the picture unclear when displaying before upload
  image.style.opacity = 0.5;
} //readFile()


function uploadFile(){
  // uploads an image within a form object.  This currently seems
  // to be the easiest way to send a big binary file.
  var url = "http://138.68.25.50:" + port;

  // where we find the file handle
  var selectedFile = document.getElementById('fileSelector').files[0];
  var formData = new FormData();
  // stick the file into the form
  formData.append("userfile", selectedFile);

  // more or less a standard http request
  var oReq = new XMLHttpRequest();
  // POST requests contain data in the body
  // the "true" is the default for the third param, so
  // it is often omitted; it means do the upload
  // asynchornously, that is, using a callback instead
  // of blocking until the operation is completed.
  oReq.open("POST", url, true);
  oReq.onload = function() {
  	// the response, in case we want to look at it
  	console.log(oReq.responseText);
  }
  oReq.send(formData);
  //finished uploading to server

  //make the img src = server url
  document.getElementById('loadingImage0').src = mainUrl + "/" + selectedFile.name;

  //make the picture clear after uploading
  document.getElementById('loadingImage0').style.opacity = 1.0;
} //uploadfile()


function togglePicMenu(){
  console.log("togglePicMenu func");
  //get the dropdown in the parent of this button?
  document.getElementById("picMenuDropDown").classList.toggle("show");
}

function changeTag(){
  console.log("changeTag function");
}

function addToFavorites(){
  console.log("addToFavorites function");
}

function addTag(){
  console.log("addTag function");
  var picCont = addTag.caller.arguments[0].target.parentElement;
  //got the picContainer

  //get the image name
  var picName = picCont.getElementsByTagName("img")[0].src.split('/')[3];

  //get the new Tag
  var newTag = picCont.getElementsByTagName("input")[0].value;

  var htmlTags = picCont.getElementsByClassName("testTag");
  //array of 10 tags in html

  //check if empty tag. return if tag is empty.
  if (!newTag){
    console.log("nice try tryign to put in an empty tag");
    return;
  }

  //callback

  function tagTransferCallback(){
      //got stuff back
    console.log("db tags received for -" + picName);
    console.log(this.response);
    var dbData = JSON.parse(this.response);
    var prevLabels = dbData.labels;

    //append the tag
    var finalLabels = "";
    //if there was no labels in the db
    if (prevLabels == ""){
      finalLabels = newTag;
    }
    //else there was some label(s) in the db
    else{
      finalLabels = prevLabels + "," + newTag;
    }

    //update the html
    finalTagsArray = finalLabels.split(",");
    for (i = 0; i < finalTagsArray.length; i++){
      htmlTags[i].innerText = finalTagsArray[i];
    }




  } //callback()

    //use the db label to append
    //update the html

  //make new url with query to get tags for the image name
  var url = mainUrl + "/query?op=getTags&fileName=" + picName;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", tagTransferCallback);
  oReq.open("GET", url);
  oReq.send();
  console.log("sent GET to server [for tags of 1 pic]")
  //on callback, addend the tag into prev tags and insert to db

} //addTag()
