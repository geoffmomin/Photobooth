var port = 8650;
var mainUrl = "http://138.68.25.50:" + port;
//https://138.68.25.50:xxxx

var favoritesHolder = document.getElementById("favoritesHolder").style;
var filterHolder = document.getElementById("filterHolder").style;
var uploadHolder = document.getElementById("uploadHolder").style;

var favoritesClass = document.getElementById("favoritesDropdown").classList;
var filterClass = document.getElementById("filterDropdown").classList;
var uploadClass = document.getElementById("uploadDropdown").classList;

var uploadMClass = document.getElementById('mobileUploadToggle').style;
var filterMClass = document.getElementById('mobileFilterToggle').style;
var favMClass = document.getElementById('mobileFavoriteToggle').style;

var template = document.getElementById('pictureContainer0');

var showFav = 0; //dont' show favs on load


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

    for (i = 0; i < dbData.length; i++){
      //clone the template. true means all child and eventhandlers
      var clone = template.cloneNode(true);

      //append early for debug
      document.getElementById("pictures").appendChild(clone);

      //hide the loadingbar
      // clone.children[3].style.display = "none";
      clone.children[3].parentElement.removeChild(clone.children[3]);

      //clone's id will be picContainer + 1...n
      clone.id = "pictureContainer" + (i + 1);

      // http://138.68.25.50:8650/cat.jpg
      clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;

      var tagArray = clone.getElementsByClassName("testTag");
      //10 tags in html

      //tags from db
      var dbTags = dbData[i].labels.split(",");

      //if dbTags returns "" - like initial db upload
      if (dbTags.length == 1 && dbTags == ""){
        for (j = 0; j < 10; j++){
          clone.children[1].children[0].removeChild(clone.children[1].children[0].children[0])
        }
      } //if db tag is empty

      //else there is valid tags returned from db
      else{
        var emptyCount = 10 - dbTags.length;
        var offset = 10 - emptyCount;

        //update html 0-nth tag and make it visible
        for (j = 0; j < dbTags.length; j++){
          tagArray[j].getElementsByTagName("div")[1].innerHTML = dbTags[j];
          tagArray[j].children[0].style.display = "none";
        }

        //make the rest invisible
        for (j = offset; j < 10; j++){
          tagArray[offset].parentElement.removeChild(tagArray[offset]);
        }

        //clone has x buttons of tags hidden
        //hide clone's add button
        clone.children[2].style.display = "none";
        //hide clone's input box
        clone.children[1].children[1].style.display = "none";
      } //else  there is tags in db
    } //for

    //hide the template
    document.getElementById("pictureContainer0").style.display = "none";
  } //reqListener()

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url);
  oReq.send();
  console.log("asked for dbAll");

} //window.onload()

function toggleMUpload(){
    if(filterMClass.display == "block" || favMClass.display == "block"){
      filterMClass.display = "none";
      favMClass.display = "none";
    }

    if(uploadMClass.display == "none"){
      uploadMClass.display = "block";
    }
    else{
      uploadMClass.display = "none";
    }

}

function toggleMFilter(){
    if(uploadMClass.display == "block" || favMClass.display == "block"){
      uploadMClass.display = "none";
      favMClass.display = "none";
    }

    if(filterMClass.display == "none"){
      filterMClass.display = "block";
    }
    else{
      filterMClass.display = "none";
    }

}

function toggleMFavorites(){
    if(filterMClass.display == "block" || uploadMClass.display == "block"){
      filterMClass.display = "none";
      uploadMClass.display = "none";
    }

    if(favMClass.display == "none"){
      favMClass.display = "block";
    }
    else{
      favMClass.display = "none";
    }

}

function toggleUpload(){
  uploadClass.toggle("show");
}

function toggleFilter() {
  filterClass.toggle("show");
}

function toggleFavorites() {
  favoritesClass.toggle("show");
}

function togglePicMenu(){
  console.log("togglePicMenu func");

  //get the dropdown in the parent of this button
  var picMenu = togglePicMenu.caller.arguments[0].target.parentElement;
  var dropDown = picMenu.parentElement;
  var picCont = dropDown.children[1];

  picCont.style.display = "block";
}

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

// Close the togglePicMenu() if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("picDropdown-content");
    var i;

    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      openDropdown.style.display = "none";

      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function undoChangeTag(){
  var picCont = undoChangeTag.caller.arguments[0].target.parentElement.parentElement;

  picCont.children[2].style.display = "none";
  picCont.children[1].children[1].style.display = "none";

  var tagCont = picCont.children[1].children[0];



  for (i = 0; i < tagCont.childElementCount; i++){
    tagCont.children[i].children[0].style.display = "none";
  }
}

function readFile() {
  document.getElementById("pictureContainer0").style.display = "block";

  //hide tags
  var tagIDs = document.getElementById("pictureContainer0").children[1].children[0];
  for (i = 0; i < tagIDs.childElementCount; i++){
    tagIDs.children[i].style.display = "none";
  }

  //hide input
  tagIDs.parentElement.children[1].style.display = "none";
  //hide add button
  tagIDs.parentElement.parentElement.children[2].style.display = "none";

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
  // dynamic file name
  document.getElementById("fileName").innerHTML = selectedFile.name;
} //readFile()

function uploadFile(){
  // uploads an image within a form object.  This currently seems
  // to be the easiest way to send a big binary file.
  var url = "http://138.68.25.50:" + port;

  // where we find the file handle
  var selectedFile = document.getElementById('fileSelector').files[0];
  //check if file is selected
  if (!selectedFile){
    console.log("nice try trying to upload nothing");
    return;
  }

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
    // location.reload();
  }
  oReq.send(formData);
  //finished uploading to server

  //make the img src = server url
  document.getElementById('loadingImage0').src = mainUrl + "/" + selectedFile.name;

  //make the picture clear after uploading
  document.getElementById('loadingImage0').style.opacity = 1.0;

  // document.getElementById("pictureContainer0").style.display = "none";

  console.log("waiting before refresh");
  // location.reload();

  //for loading bar
  function move() {
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
        elem.innerHTML = width * 1  + '%';
      }
    }
  } //move()
  move();

  setTimeout(function(){ location.reload() }, 3000);
} //uploadfile()

function addTag(){
  console.log("addTag function");

  //got the picContainer
  var picCont = addTag.caller.arguments[0].target.parentElement;

  //tag container
  var tagCont = picCont.getElementsByClassName("tagIDs")[0];

  //if there is 10 tags already
  if (tagCont.childElementCount >= 10){
    console.log("nice try trying to add more than 10 tags");
    return;
  }

  //get the image name
  var picName = picCont.getElementsByTagName("img")[0].src.split('/')[3];

  //get the new Tag
  var newTag = picCont.getElementsByTagName("input")[0].value;
  //check if empty tag. return if tag is empty.
  if (!newTag){
    console.log("nice try trying to put in an empty tag");
    return;
  }

  //update html with new tag
  //there is space to add tag and tag is valid
  var imgAndTag = template.children[1].children[0].children[0].cloneNode(true);
  //template.children[1].children[0].children[0].children[1] is tagName

  //put new tag in html
  imgAndTag.children[1].innerText = newTag;

  tagCont.appendChild(imgAndTag);

  //update database with new tag for this pic
  //callback
  function tagTransferCallback(){
    //got stuff back
    // location.reload();
    console.log("db tags received for -" + picName);
    console.log(this.response);
    var dbData = JSON.parse(this.response);
    var prevLabels = dbData.labels;

    //check if there's 10 tags already
    if (prevLabels.split(",").length >= 10){
      console.log("there's 10 tags already in db. returning tagTransferCallback");
      return;
    }

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

    //update the db
    function updateTagsCallback(){
      console.log("callback for updateTags");
    }
    //callback()
    var url2 = mainUrl + "/query?op=updateTags&fileName=" + picName + "&newTags=" + finalLabels;
    var oReqq = new XMLHttpRequest();
    oReqq.addEventListener("load", updateTagsCallback);
    oReqq.open("GET", url2);
    oReqq.send();
    console.log("sent GET to server [for update tags] of - " + picName);
  } //callback()

  //make new url with query to get tags for the image name
  var url = mainUrl + "/query?op=getTags&fileName=" + picName;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", tagTransferCallback);
  oReq.open("GET", url);
  oReq.send();
  console.log("sent GET to server [for getTags] of - " + picName);
  //on callback, addend the tag into prev tags and insert to db??

  //clear the input box after we put in a tag
  picCont.getElementsByTagName("input")[0].value = '';
} //addTag()

function removeTag(){
  console.log("removeTag function");

  //get the container that has icon+tag
  var tagCont = removeTag.caller.arguments[0].target.parentElement.parentElement;

  var allTagsCont = tagCont.parentElement;
  var tagToRemove = tagCont.children[1];
  var picName = tagCont.parentElement.parentElement.parentElement.children[0].children[0].src.split("/")[3];
  //remove from DOM
  tagCont.parentNode.removeChild(tagCont);

  var finalLabels = '';
  for (i = 0; i < allTagsCont.childElementCount; i++){
    var curTag = allTagsCont.children[i].children[1].innerText;
    if (curTag != ""){
      finalLabels += ("," + curTag);
    }
  }
  finalLabels = finalLabels.substring(1);

  //update the new tags to db
  var url = mainUrl + "/query?op=updateTags&fileName=" + picName + "&newTags=" + finalLabels;

  //update the db that we added a tag
  function updateTagsCallback(){
    console.log("callback for updateTags");
  }
  //callback()
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", updateTagsCallback);
  oReq.open("GET", url);
  oReq.send();
  console.log("sent GET to server [for update tags] of - " + picName);
} //removeTag()

function changeTag(){
  // -display x buttons for tags
  // -display input box
  // -display add button
  console.log("changetag func");
  var picCont = changeTag.caller.arguments[0].target.parentElement.parentElement.parentElement.parentElement;

  var tagIDs = picCont.children[1].children[0];
  var inputBox = picCont.children[1].children[1];
  var addButton = picCont.children[2];

  for (i = 0; i < tagIDs.childElementCount; i++){
    tagIDs.children[i].children[0].style.display = "block";
  }
  inputBox.style.display = "block";
  addButton.style.display = "block";
}

function addToFavorites(){
  console.log("addToFavorites function");

  //get name of pic
  var picName = addToFavorites.caller.arguments[0].target.parentElement.parentElement.parentElement.children[0].src.split("/")[3];

  //make url query
  var url = mainUrl + "/query?op=favorite&fileName=" + picName;

  //make callabck
  function addToFavoritesCallback(){
    console.log("callabck for addToFavorites");
  }

  //new xmlrequest
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", addToFavoritesCallback);
  oReq.open("GET", url);
  oReq.send();
  console.log("sent GET to server [for addToFavorites] of - " + picName);
} //addToFavorites()


function clearFilter(){
  console.log("clearFilter");
  document.getElementById("filterSearch").value = "";
  location.reload();
}


function showFilteredPics(){
  console.log("showFilteredPics");
  var filter = document.getElementById("filterSearch").value;
  if (!filter){
    console.log ("nice try filtering by nothing");
    return;
  }


  function filterCallback(){
    console.log("got filtered pics");
    console.log(this.response);
    var dbData = JSON.parse(this.response);
    //array of all pics in db that are favorited

    //if there is no favorites, show all. we are already showing all.
    if (dbData.length == 0){
      var pics = document.getElementById("pictures");
      while (pics.childElementCount > 1){
        pics.removeChild(pics.children[1]);
      }
      return;
    }

    //remove every pic and show only favs.
    var pictures = document.getElementById("pictures");
    while (pictures.childElementCount != 1){
      pictures.children[1].parentElement.removeChild(pictures.children[1]);
    }

    //do something for each thing returned
    for (i = 0; i < dbData.length; i++){
      //clone the template. true means all child and eventhandlers
      var clone = template.cloneNode(true);

      //append early for debug
      document.getElementById("pictures").appendChild(clone);

      //make it visible
      clone.style.display = "flex";

      //remove the loading bar
      clone.children[3].style.display = "none";

      //clone's id will be picContainer + 1...n
      clone.id = "pictureContainer" + (i + 1);

      // http://138.68.25.50:8650/cat.jpg
      clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;

      var tagArray = clone.getElementsByClassName("testTag");
      //10 tags in html

      //tags from db
      var dbTags = dbData[i].labels.split(",");

      //if dbTags returns "" - like initial db upload
      if (dbTags.length == 1 && dbTags == ""){
        for (j = 0; j < 10; j++){
          clone.children[1].children[0].removeChild(clone.children[1].children[0].children[0])
        }
      } //if db tag is empty

      //else there is valid tags returned from db
      else{
        var emptyCount = 10 - dbTags.length;
        var offset = 10 - emptyCount;

        //update html 0-nth tag and make it visible
        for (j = 0; j < dbTags.length; j++){
          tagArray[j].getElementsByTagName("div")[1].innerHTML = dbTags[j];
          tagArray[j].children[0].style.display = "none";
        }

        //make the rest invisible
        for (j = offset; j < 10; j++){
          tagArray[offset].parentElement.removeChild(tagArray[offset]);
        }

        //clone has x buttons of tags hidden
        //hide clone's add button
        clone.children[2].style.display = "none";
        //hide clone's input box
        clone.children[1].children[1].style.display = "none";
      } //else  there is tags in db
    } //for
  } //callback

  var url = mainUrl + "/query?op=getFilter&filter=" + filter;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", filterCallback);
  oReq.open("GET", url);
  oReq.send();
  console.log("sent GET to server [for getFilter]");

  showFilter = 1; //show favs turned on

}


function showFavoritePics(){
  console.log("showFavoritePics");

  //if we run this func and we weren't showing favs before, then show them
  if (!showFav){
    function showFavCallback(){
      console.log("got fav pics");
      console.log(this.response);
      var dbData = JSON.parse(this.response);
      //array of all pics in db that are favorited

      //if there is no favorites, show all. we are already showing all.
      if (dbData.length == 0){
        var pics = document.getElementById("pictures");
        while (pics.childElementCount > 1){
          pics.removeChild(pics.children[1]);
        }
        return;
      }

      //remove every pic and show only favs.
      var pictures = document.getElementById("pictures");
      while (pictures.childElementCount != 1){
        pictures.children[1].parentElement.removeChild(pictures.children[1]);
      }

      //do something for each thing returned
      for (i = 0; i < dbData.length; i++){
        //clone the template. true means all child and eventhandlers
        var clone = template.cloneNode(true);

        //append early for debug
        document.getElementById("pictures").appendChild(clone);

        //make it visible
        clone.style.display = "flex";

        //remove the loading bar
        clone.children[3].style.display = "none";

        //clone's id will be picContainer + 1...n
        clone.id = "pictureContainer" + (i + 1);

        // http://138.68.25.50:8650/cat.jpg
        clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;

        var tagArray = clone.getElementsByClassName("testTag");
        //10 tags in html

        //tags from db
        var dbTags = dbData[i].labels.split(",");

        //if dbTags returns "" - like initial db upload
        if (dbTags.length == 1 && dbTags == ""){
          for (j = 0; j < 10; j++){
            clone.children[1].children[0].removeChild(clone.children[1].children[0].children[0])
          }
        } //if db tag is empty

        //else there is valid tags returned from db
        else{
          var emptyCount = 10 - dbTags.length;
          var offset = 10 - emptyCount;

          //update html 0-nth tag and make it visible
          for (j = 0; j < dbTags.length; j++){
            tagArray[j].getElementsByTagName("div")[1].innerHTML = dbTags[j];
            tagArray[j].children[0].style.display = "none";
          }

          //make the rest invisible
          for (j = offset; j < 10; j++){
            tagArray[offset].parentElement.removeChild(tagArray[offset]);
          }

          //clone has x buttons of tags hidden
          //hide clone's add button
          clone.children[2].style.display = "none";
          //hide clone's input box
          clone.children[1].children[1].style.display = "none";
        } //else  there is tags in db
    } //for
    } //callback

    var url = mainUrl + "/query?op=getFavorites";
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", showFavCallback);
    oReq.open("GET", url);
    oReq.send();
    console.log("sent GET to server [for getFavorites]");

    showFav = 1; //show favs turned on
  } //if

  //else we were showing favs before; then don't show them
  else{
    showFav = 0;
    location.reload();
  } //else
} //showFavoritePics()

$("button").click(function() {
    $('html,body').animate({
        scrollTop: $("main").offset().top},
        'slow');
});

// function scrollDown() {
//   console.log("scroll down");
//
//   var endofpage = scrollDown.caller.arguments[0].target.parentElement;
//   //var endofpage = document.getElementById("welcome");
//   var rect = endofpage.getBoundingClientRect();
//   console.log(rect.bottom);
//   window.scrollTo(0, rect.bottom - 100);
// }
