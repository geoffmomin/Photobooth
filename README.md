We worked in a group of 3. The names and SID's are in Authors.txt.


How to run our app:
SETUP:
ssh into the server (138.68.25.50) and go to /home/nexisn4.
place tripleThreatServer.js into that location. (overwrite is ok - we have backups)
also place photos.db into /home/nexisn4.
clear the photos.db database (database shoudl be empty but run this just in case - run "$sqlite3 photos.db" then "delete from photolabels;")
place the photobooth folder + main.html/js/css into /home/nexisn4/public/run
you are ready to run the app.

RUN:
Go to /home/nexisn4 on our server and run "node tripleThreatServer.js" and server will start.
Go to a browser and type "http://138.68.25.50:8650/run/main.html" in the url. our app will load.

USAGE:
You will be taken to splash page. You can click enter or scroll down to the main page.
If you upload a picture and it doesn't show within 5 seconds, refresh the page. However, there is a progress bar to let you know of its progress. It should show you all the pictures when one finishes uploading.
You can filter by a label using the sidebar. If there is not any photos that have that label, you will not see any pictures.
	Click clear filter to show all photos.
You can show all favorites by clicking the favorites on the sidebar and clicking favorites. If there is not any photos that have been favorited, you will not see any pictures.
	Clicking it again will show all photos as normal.
You can change the tags for a photo by clicking the triangle menu -> change tags.
	You can exit change tags menu by clicking on the picture.

EXTRA CREDIT:
Filtering by favorites DONE
Progress bar DONE
