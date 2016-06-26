var express = require('express');
var app = express();

var datetime = require('node-datetime');
  
var Cab = function (name, lng, lat, idle, pink) {
    this._name = name;
	this._lng = lng;
	this._lat = lat;
	this._idle = idle;
	this._pink = pink;
	this._tripStart = datetime.create();
};

Cab.prototype.bookCab = function () {
    this._idle = false;
	this._tripStart = datetime.create();
};

Cab.prototype.changePos = function (lng, lat) {
	this.lng = lng;
	this.lat = lat;
};

Cab.prototype.releaseCab = function (end) {
	this._idle = true;
	this.changePos(end.lng, end.lat);
};



var cab1 = new Cab('Cab1', 1, 5, true, false);
var cab2 = new Cab('Cab2', 2, 7, true, true);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var getDist = function(lng, lat, cab) {
  return Math.sqrt(Math.pow((lng - cab.lng), 2) + Math.pow((lat - cab.lat), 2));
};

app.get('/book', function(req, res) {
    var start = req.query.Source;
	//console.log(lng+lat);
	var dist = -1, asgnCab, pink = start.pink;
	for (var cabs in Cab) {
		if(cabs.idle || (!pink || (pink == cabs._pink))) {
			var tempDist = getDist(start.lng, start.lat, cabs);
			if(tempDist<dist || dist == -1) {
				dist = tempdist;
				asgnCab = cabs;
			}
		}
	}
	if(asgnCab) {
		asgnCab.bookCab();
		res.send(asgnCab);
	}
	else {
		res.send("Error:404")
	}
});

app.get('/endTrip', function(req, res) {
    var start = req.query.Source,
	end = req.query.Dest,
	asgnCab = req.query.asgnCab;
	var timeTaken = (datetime.create()).now() - asgnCab._tripStart.now();
	var fare = ((getDist(start.lng, start.lat, end))*2) + (timeTaken/60000);
	if(asgnCab._pink)
		fare += 5;
	asgnCab.releaseCab();
	console.log("fare= "+fare);
	res.send("fare:"+fare);
});
