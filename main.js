var port = 8650;


function toggleUpload() {
      document.getElementById("myDropdown").classList.toggle("show");
      var favoritesHolder = document.getElementById("favoritesHolder").style;
      var filterHolder = document.getElementById("filterHolder").style;

      favoritesHolder.position = "relative";
      favoritesHolder.top = "50px";
      filterHolder.position = "relative";
      filterHolder.top = "50px";
}

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
}


// function fadeImage() {
//     var image = document.getElementById('theImage');
//     var button = document.getElementById('fadeButton');
//     if (button.textContent == 'Fade') {
//     	image.style.opacity = 0.5;
//     	button.textContent = 'UnFade';
//     }
//     else {
//     	image.style.opacity = 1.0;
//     	button.textContent = 'Fade';
//     }
// }


function readFile() {
    var selectedFile = document.getElementById('fileSelector').files[0];
    var image = document.getElementById('loadingImage');

    var fr = new FileReader();
    // anonymous callback uses file as image source
    fr.onload = function () {
	     image.src = fr.result;
    };
    fr.readAsDataURL(selectedFile);    // begin reading
    // make the picture unclear when displaying before upload
    image.style.opacity = 0.5;
}


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

  //make the picture clear after uploading
  document.getElementById('loadingImage').style.opacity = 1.0;

} //uploadfile()
