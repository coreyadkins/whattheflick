//Scoring Module

// The lower score the better
// Points are given for each mile between the coordinate selected and the coordinate from the flickr image
// you can also get points for taking the hint

/**
* Haversine formula for distance between coordinates
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
* Add points for taking hint
*/

// for score management

var scoreBoard = {
  points: 0,
  addPoints: function(amount) {
    this.points += amount;
  }
};

/**
* score a choice
*/
function scoreAttempt(coordinates, scoreBoard) {
  scoreBoard.addPoints(function(coordinates) {
    var lat1 = coordinates[0];
    var lon1 = coordinates[1];
    var lat2 = coordinates[2];
    var lon2 = coordinates[3];
    return distance(lat1, lon1, lat2, lon2)
  })
}
