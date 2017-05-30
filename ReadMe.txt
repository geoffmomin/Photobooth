We worked in a group of 3. The names and SID's are in Authors.txt.


How to run our app:
SETUP:
ssh into the server (138.68.25.50) and go to /home/nexisn4.
place tripleThreatServer.js into that location. (overwrite is ok - we have backups)
clear the photos.db database (run "$sqlite3 photos.db" then "delete from photolabels;")
place the photobooth folder + main.html/js/css into /home/nexisn4/public/run
you are ready to run the app.

RUN:
Go to /home/nexisn4 on our server and run "node tripleThreatServer.js" and server will start.
Go to a browser and type "http://138.68.25.50:8650/run/main.html" in the url. our app will load.

USAGE:
If you upload a picture and it doesn't show within 5 seconds, refresh the page.
You can show all favorites by clicking the favorites on the sidebar and clicking favorites.
	Clicking it again will show all photos as normal.
You can filter by a label using the sidebar. Click clear filter to show all photos.
You can change the tags for a photo by clicking the triangle menu -> change tags.
	You can exit change tags menu by clicing on the picture.

EXTRA CREDIT: 
Filtering by favorites DONE
Progress bar DONE

