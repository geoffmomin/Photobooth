var port = 8650;
var mainUrl = "http://138.68.25.50:" + port;
//https://138.68.25.50:xxxx

window.onload=function(){
  console.log('onLoad function');
  //want to get all things in the db
    // query looks liek this - 138.68.25.50:1935/query?img=hula.jpg
  var url = mainUrl + "/query?op=dump";

  function reqListener () {
    //this.response contains json/ARRAY?? of all files in db
    console.log("dbAll received");
    console.log(this.response);
    var dbData = JSON.parse(this.response)

    //should display these items.
    //if there is nothing in db, display nothing
    if (dbData.length == 0){
      document.getElementById("pictureContainer0").style.visibiliety = "hidden";
    }

    //there is 1 or more stuff in db.
    else{
      document.getElementById("pictureContainer0").style.visibiliety = "visible";

      for (i = 0; i < dbData.length; i++){
        //if it's the first div
        if (i == 0){
          var target = document.getElementById('pictureContainer0');
          target.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;
        } //if

        //else not 1st div
        else{
          var target = document.getElementById('pictureContainer0');
          clone = target.cloneNode(true); // true means clone all childNodes and all event handlers
          //clone's id will be picContainer + 1...n
          clone.id = "pictureContainer" + i;

          // http://138.68.25.50:8650/cat.jpg
          clone.getElementsByTagName('img')[0].src = mainUrl + "/" + dbData[i].fileName;

          //add the container into pictures container
          document.getElementById("pictures").appendChild(clone);
        } //else not 1st div
      } //for db.length
    } //else there is 1 or more stuff in db

  } //reqListener()

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url);
  oReq.send();
  console.log("asked for dbAll");

} //window.onload()


function toggleUpload() {
  document.getElementById("myDropdown").classList.toggle("show");
  var favoritesHolder = document.getElementById("favoritesHolder").style;
  var filterHolder = document.getElementById("filterHolder").style;

  favoritesHolder.position = "relative";
  favoritesHolder.top = "50px";
  filterHolder.position = "relative";
  filterHolder.top = "50px";
} //toggleUPload()

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    var favoritesHolder = document.getElementById("favoritesHolder").style;
    var filterHolder = document.getElementById("filterHolder").style;

    favoritesHolder.position = "relative";
    favoritesHolder.top = "0px";
    filterHolder.position = "relative";
    filterHolder.top = "0px";
  }
} //window.onclick


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
