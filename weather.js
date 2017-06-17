$(function() {
  $("#day").html(getFullDay());
  $("#date").html(getFDate());
  $("#time").html(getTime());
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(Forecast, showError);
  }
  $("#temp").on("click", function() {
    var currentTemp = $("#temp").text();
    var tempArr = currentTemp.split("");
    var mode = tempArr.pop();
    var temp = parseInt(tempArr.join(""));
    if (mode === "F") {
     var newTemp = Math.round((temp - 32) * 5 / 9);
      $(this).html(newTemp + "°C");
    } else {
     var newTemp = Math.round((temp * 9 / 5) + 32);
      $(this).html(newTemp + "°F");
    }
  });

});

function Forecast(position) {
  var longitude = position.coords.longitude;
  var latitude = position.coords.latitude;
  $.ajax({
    url: "https://api.darksky.net/forecast/0a73c353c5cf5a5625ca6707fb1c6f94/" +
      latitude +
      "," +
      longitude,
    type: "GET",
    dataType: "jsonp",
    success: function(weather) {
      geoCity(weather.longitude, weather.latitude);
      var temp = Math.round(weather.currently.temperature);
      $("#temp").html(temp + "°F");
      $("#status").append(
        '<i id="today" class="wi wi-' +
          weatherIcon(weather.currently.icon) +
          '" style="font-size: 25pt;"></i>'
      );
      $("#weather_summary").html("<p>" + weather.daily.summary + "</p>");

      var range = weather.daily.data.length;
      weekReport(range, weather.daily.data);
    },
    cache: false
  });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      break;
    case error.LOCATION_UNAVAILABLE:
      break;
    case error.TIMEOUT:
      break;
    case error.UNKNOWN_ERROR:
      break;
  }
}

function getFDate() {
  var date = String(new Date());
  dateArr = date.split(" ");
  var month = "";
  switch (dateArr[1]) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
  }
  var numDate = month + "/" + dateArr[2];
  return numDate;
}

function getFullDay() {
  switch (new Date().getDay()) {
    case 0:
      var day = "Sunday";
      break;
    case 1:
      var day = "Monday";
      break;
    case 2:
      var day = "Tuesday";
      break;
    case 3:
      var day = "Wednesday";
      break;
    case 4:
      var day = "Thursday";
      break;
    case 5:
      var day = "Friday";
      break;
    case 6:
      var day = "Saturday";
  }
  return day;
}

function getTime() {
  var date = String(new Date());
  var dateArr = date.split(" ");
  var rawTime = String(dateArr[4]);
  var time = rawTime.split(":"); // convert to array

  // fetch
  var hour = Number(time[0]);
  var minutes = Number(time[1]);

  // calculate
  var timeValue;

  if (hour > 0 && hour <= 12) {
    timeValue = "" + hour;
  } else if (hour > 12) {
    timeValue = "" + (hour - 12);
  } else if (hour == 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
  timeValue += hour >= 12 ? " PM" : " AM"; // get AM/PM

  return timeValue;
}

function weatherIcon(icon) {
  /* All Possible Weather clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night */
  var code = "";
  switch (icon) {
    case "clear-day":
      code = "day-sunny";
      break;
    case "clear-night":
      code = "night-clear";
      break;
    case "rain":
      code = "rain";
      break;
    case "snow":
      code = "snowflake-cold";
      break;
    case "sleet":
      code = "sleet";
      break;
    case "wind":
      code = "strong-wind";
      break;
    case "fog":
      code = "fog";
      break;
    case "cloudy":
      code = "cloudy";
      break;
    case "partly-cloudy-day":
      code = "day-cloudy";
      break;
    case "partly-cloudy-night":
      code = "night-cloudy";
      break;
  }
  return code;
}

function weekReport(range, data) {
  var date = "";
  for (var i = 1; i <= range - 1; i++) {
    date = new Date(data[i]["time"] * 1000);
    var dateArr = String(date).split(" ");
    var day = dateArr[0].toUpperCase();
    $("#calendar").append(
      '<div class="col-lg-auto weekday"><h3>' +
        day +
        "</h3><h2>" +
        dateArr[2] +
        '</h2><i class="rain wi wi-' +
        weatherIcon(data[i]["icon"]) +
        '"></i></div>'
    );
  }
}

function geoCity(longitude, latitude) {
  var city = "";
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAulip0L6RQlEtQZNZFcYV35nElDpBjMqI&latlng=" +
      latitude +
      "," +
      longitude +
      "&sensor=true",
    type: "GET",
    dataType: "json",
    success: function(geoloc) {
      var addressComponents = geoloc.results[0].address_components;
      for (i = 0; i < addressComponents.length; i++) {
        var types = addressComponents[i].types;
        //alert(types);
        if (types == "locality,political") {
          city = addressComponents[i].long_name;
          $("#location").html("<p>" + city + "</p>");
        }
      }
    },
    cache: false
  });
}
