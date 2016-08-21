'use strict';

/* global getPhoto, getTopCountriesList, milesBetweenPoints, linkPoints */

var TOTAL_ROUNDS = 5;
var roundNumber = 1;
var topCountriesList;
var photo;

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
 * Preload photo, fade out old, replace with new
 *
 * @param {String} url
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
 *
 */
function displayNextPhoto() {
  // TODO: disable map interaction
  photo = getPhoto(topCountriesList);
  placePhoto(photo.url);
  // TODO: re-enable map interaction
}

/**
 * TODO
 */
function askPlayAgain() {
  if (confirm('Play again?')) {
    resetMap(); // eslint-disable-line no-undef
    roundNumber = 1;
    displayNextPhoto();
  }
}

/**
 * Primary game interaction
 */
function handleLocationClick(clickCoord) {
  var actualCoord = photo.coordinate;
  linkPoints(actualCoord, clickCoord);

  var distance = milesBetweenPoints(photo.coordinate, clickCoord);

  $('.hints ul').html(
    '<li>Actual: ' + photo.coordinate.latitude + ', ' +
    photo.coordinate.longitude + '</li>' +
    '<li>Guess: ' + clickCoord.latitude + ', ' +
    clickCoord.longitude + '</li>' +
    '<li>Distance: ' + distance + ' mi</li>'
  );

  ++roundNumber;
  if (roundNumber > TOTAL_ROUNDS) {
    window.setTimeout(askPlayAgain, 1000);
  } else {
    displayNextPhoto();
  }
}

/**
 * main
 */
$().ready(function() {
  roundNumber = 1;
  topCountriesList = getTopCountriesList();
  displayNextPhoto();
  initializeMap(handleLocationClick); // eslint-disable-line no-undef
});
