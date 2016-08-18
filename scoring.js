'use strict';

//Scoring Module

// The lower score the better
// Points are given for each mile between the coordinate selected and the coordinate from the flickr image
// you can also get points for taking the hint

/**
* Haversine formula for distance between coordinates, removed the non-miles calculations
*/
function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	return dist
}

/**
* Scoreboard Constructor
*/
function ScoreBoard() {
  this.score = 0;
  this.getScore = function() {
    return this.score();
  };
  // adding the points for the distance between guess and coords or if use a hint
  // could also add some aditional lines to link to HTML/CSS to print the score
  // on the screen in red
  this.addPoints = function(amount) {
    this.score += Math.ceil(amount);
  };
  // removes points if they guess a hint correctly
  this.removePoints = function(amount) {
    this.score -= amount;
  }
}



/**
* take in a list of coordinates and return the distance, the distance function
* requires
*/
function milesBetweenPoints(flickrCoord, clickCoord) {
  var lat1 = flickrCoord['lat'];
  var lon1 = flickrCoord['lng'];
  var lat2 = clickCoord['lat'];
  var lon2 = clickCoord['lng'];
  return distance(lat1, lon1, lat2, lon2)
}



//test stuff
var testScoreboard = new ScoreBoard();
//two random places in Portland
var testFlickr = {lat: 45.520899, lng: -122.683658};
var testClick = {lat: 45.522989, lng: -122.687199};
testScoreboard.addPoints(milesBetweenPoints(testFlickr, testClick));
console.log(testScoreboard);
