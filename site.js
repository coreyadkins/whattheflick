'use strict';

/**
 *
 *
 * @param {any} imgWidth
 * @param {any} imgHeight
 * @param {any} boxWidth
 * @param {any} boxHeight
 */
function fitDimsToBounds(imgWidth, imgHeight, boxWidth, boxHeight) {
  var aspect = imgWidth / imgHeight;
  var dims = {
    width: Math.min(boxWidth, imgWidth),
    height: Math.min(boxHeight, imgHeight)
  };

  if (aspect > boxWidth / boxHeight) {
    // fit to width
    dims.height = Math.round(dims.width / aspect);
  } else {
    // fit to height
    dims.width = Math.round(dims.height * aspect);
  }

  return dims;
}


/**
 *
 *
 * @param {any} latLng
 */
function placePhoto(url) {
  $('<img>').attr('src', url).on('load', function(loadEvt) {
    var $img = $('.photo img');
    $img.fadeOut('fast', function() {
      var $box = $('.photo').removeClass('empty');

      var dims = fitDimsToBounds(
        loadEvt.currentTarget.width,
        loadEvt.currentTarget.height,
        $box.width(),
        $box.height()
      );

      $img.
        attr('width', dims.width).
        attr('height', dims.height).
        attr('src', url).
        fadeIn('slow')
      ;
    });
  });
}

/**
 * Placeholder function
 */
function locationClickHandler(latLng) {
  return latLng;
}

function setUp(topCountriesList) {
  var photo = getPhoto(topCountriesList); // eslint-disable-line no-undef
  initializeMap(locationClickHandler); // eslint-disable-line no-undef
  placePhoto(photo.url); // eslint-disable-line no-undef
}

function main() {
  var roundsPlayed = 0;
  var scoreBoard = new ScoreBoard(); // eslint-disable-line no-undef
  var topCountriesList = getTopCountriesList(); // eslint-disable-line no-undef
  var photo = setUp(topCountriesList)
  while (roundsPlayed < 5) {
    var photo = setUp(topCountriesList);
    var clickLoc = locationClickHandler();
    if (typeof clickLoc != 'undefined') {
      scoreBoard += milesBetweenPoints(photo, clickLoc); // eslint-disable-line no-undef
      roundsPlayed += 1;
    }
  }
}

/**
 * main
 */
$().ready(function() {
  main();
});


//// Test features ////
// function dum
