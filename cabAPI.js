var express = require('express');
var app = express();
var normalCab = [];
var pinkCab = [];
var bookedCab = [];

var Cab = function (id, lng, lat, pink) {
    this._id = id;
    this._lng = lng;
    this._lat = lat;
    this._idle = true;
    this._pink = pink;
    this._tripStart = new Date();
    if (pink)
        pinkCab.push(this);
    else
        normalCab.push(this);
};

Cab.prototype.bookCab = function (List, i) {
    this._idle = false;
    this._tripStart = new Date();
    List.splice(i, 1);
    bookedCab.push(this);
};

//Cab.prototype.changePos = function (lng, lat) {
//    this.lng = lng;
//    this.lat = lat;
//};
//
//Cab.prototype.releaseCab = function (end, List) {
//    this._idle = true;
//    this.changePos(end.LNG, end.LAT);
//    var index = List.indexOf(this);
//    List.splice(index, 1);
//    List.unshift(this);
//};



new Cab('Cab1', 0, 7, true);
new Cab('Cab2', 2, 11, true);
new Cab('Cab3', 3, 10, false);
new Cab('Cab4', 4, 9, false);
new Cab('Cab5', 5, 8, false);
new Cab('Cab6', 6, 7, false);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var getDist = function (lng, lat, lngD, latD) {
    return Math.sqrt(Math.pow((parseInt(lng) - lngD), 2) + Math.pow((parseInt(lat) - latD), 2));
};

app.get('/book', function (req, res) {
    var start = req.query, data = {};
    //console.log(lng+lat);
    var dist = -1, index = -1, List;
    if (start.Pink === "true")
        List = pinkCab;
    else
        List = normalCab;
    for (var i in List) {
        var tempDist = getDist(start.srcX, start.srcY, List[i]._lng, List[i]._lat);
        if (tempDist < dist || dist === -1) {
            dist = tempDist;
            index = i;
        }
    }
    if (index !== -1) {
        data.booked = true;
        data.id = List[index]._id;
        data.dist = dist.toFixed(2);
        List[index].bookCab(List, index);

    } else {
        data.booked = false;
    }
    res.send(data);
});

app.get('/endTrip', function (req, res) {
    var data = req.query,
            srcX = data.srcX,
            srcY = data.srcY,
            destX = data.destX,
            destY = data.destY,
            cabId = data.cab,
            start = new Date(data.start),
            resp = {};
    for (var i in bookedCab) {
        if (bookedCab[i]._id === cabId) {
            var cab = bookedCab[i],
                    pink = (cab._pink === true),
                    timeTaken = (((new Date()).getTime() - start.getTime()) / 60000),
                    dist = getDist(srcX, srcY, destX, destY),
                    fare = (dist * 2) + timeTaken;
            if (pink) {
                fare += 5;
            } 
            new Cab(cabId, destX, destY, pink);
            resp.fare = fare;
            resp.distance = dist;
            resp.time = timeTaken;

            bookedCab.splice(i, 1);
            console.log(pinkCab.length);
            console.log(normalCab.length);
            console.log(bookedCab.length);
            break;
        }
    }
    res.send(resp);
});

app.listen(3000);