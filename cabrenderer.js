/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var src = {}, dest = {}, cabId, start;
$(document).ready(function () {
    $("#booked").hide();
    
});
var callAPI = function (pink) {
    src.x = parseInt($("#txtSrcX").val());
    src.y = parseInt($("#txtSrcY").val());
    dest.x = parseInt($("#txtDestX").val());
    dest.y = parseInt($("#txtDestY").val());

    if (isNaN(src.x) || isNaN(src.y)) {
        alert("Please enter Longitude and Latitude");
        return;
    }
    var parameters = {srcX: src.x, srcY: src.y, Pink: pink};
    $.get('http://127.0.0.1:3000/book', parameters, function (data) {
        if (data.booked === true) {
            cabId = data.id;
            $("#cabId").text("Id of the assigned cab is: " + cabId + ". It is " + data.dist + " km away");
            $("#request").hide();
            $("#booked").show();
        } else
            alert("No cab available now, please try later");
    });
};


$("#btnBookNormal").on("click", function () {
    callAPI(false);
});

$("#btnBookPink").on("click", function () {
    callAPI(true);
});

$("#btnStartTrip").on("click", function (){
    console.log("Starting trip");
    $(this).prop( "disabled", true );
    start = new Date();
    $("#cabId").text("Cab id of the assigned cab is: " + cabId + ". You are on the way");
    $("#btnEndTrip").prop( "disabled", false );
});

$("#btnEndTrip").on("click", function () {
    console.log("Ending Trip");
    var parameters = {srcX: src.x,
        srcY: src.y,
        destX: dest.x,
        destY: dest.y,
        cab: cabId,
        start: start
    };
    $.get('http://127.0.0.1:3000/endTrip', parameters, function (data) {
        if(!alert("Trip Completed!\nFare: Rs " + parseFloat(data.fare).toFixed(2) +
                "\nTime taken: " + Math.floor(data.time) +
                " min " + Math.floor((data.time % 1)*60) + 
                " sec\nDistance Travelled:" + parseFloat(data.distance).toFixed(2) + " km")) {
        location.reload();
    }
    });
});
