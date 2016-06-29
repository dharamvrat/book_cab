# book_cab

Steps to book a cab after the API and HTML are up and running:
1. Give source and destination longitude/lattitude manually(this can be done by taking location from GPS in realtime application). 
2. Click on "Normal" to book normal cab and "Pink" to book pink cab.When we click on the button, the source location and cab type will be sent to the server and the nearest cab from the either pink or normal pool will be taken out and put into a Booked pool.
3. Next page will show the Cab ID(which can be replaced by Cab number in realtime application) and distance from source location.
4. Trip will start when we click on Start Trip button. This time will be noted down in client (to make it more secure, we can make a call to server to save it there) and the End Trip button will be enabled.
5. When we click on End Trip button, source, destination, start time etc. information is sent to server, where the fare, distance, time taken is calculated and sent to client. Also, the cab from the booked pool is taken and added to respective cabs pool with changed coordinates.
6. The information is shown in alert box and the home page is reloaded when we close the alert.
