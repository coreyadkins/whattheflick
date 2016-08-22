'use strict';

var TOTAL_ROUNDS = 5;
var roundNumber = 1;
var topCountriesList;
var photo;
var clues; // eslint-disable-line no-unused-vars

var PREVIEW_IN = {
  left: '1em',
  right: '1em',
  top: '3em',
  bottom: '1em',
};

var PREVIEW_OUT = {
  left: '49%',
  right: '49%',
  top: '66%',
  bottom: '68%',
};

/**
 *
 *
 * @param {any} imgWidth
 * @param {any} imgHeight
 * @param {any} boxWidth
 * @param {any} boxHeight
 */
function fitDimsToBounds(imgWidth, imgHeight, boxWidth, boxHeight, constrain) {
  var aspect = imgWidth / imgHeight;
  var sizeMethod = constrain ? Math.min : Math.max;
  var dims = {
    width: sizeMethod(boxWidth, imgWidth),
    height: sizeMethod(boxHeight, imgHeight)
  };

  if (aspect > boxWidth / boxHeight) {
    // fit to width
    dims.height = dims.width / aspect;
  } else {
    // fit to height
    dims.width = dims.height * aspect;
  }

  dims.width = Math.round(dims.width);
  dims.height = Math.round(dims.height);
  return dims;
}


/**
 * Preload photo, fade out old, replace with new
 *
 * @param {String} url
 */
function placePhoto(url) {
  $('<img>').attr('src', url).on('load', function(loadEvt) {
    $('.zoom img').
      attr('src', url).
      attr('width', 0).
      attr('height', 0)
    ;

    var $img = $('.photo img');
    $img.fadeOut('fast', function() {
      var $box = $('.photo').removeClass('empty');

      var dims = fitDimsToBounds(
        loadEvt.currentTarget.width,
        loadEvt.currentTarget.height,
        $box.width(),
        $box.height(),
        true
      );

      $img.
        attr('width', dims.width).
        attr('height', dims.height).
        attr('src', url).
        data('nativeWidth', loadEvt.currentTarget.width).
        data('nativeHeight', loadEvt.currentTarget.height).
        fadeIn('slow')
      ;

    });
  });
}

/**
 * Placeholder function
=======
 * Dimensions of page
 *
 * @return {width: px, height: px}
 */
function getDocDims() {
  var $body = $('body');
  return {width: $body.width, height: $body.height()};
}

/**
 * Blow up the image
 */
function zoomImage() {
  var $ref = $('.photo img');

  if ($ref.attr('src')) {
    var speed = 'slow';
    var twoEm = $('header').height();

    var bDims = getDocDims();
    var zDims = fitDimsToBounds(
      $ref.width(),
      $ref.height(),
      bDims.width - twoEm,
      bDims.height - twoEm * 2,
      false
    );

    $('body').addClass('preview');
    $('.zoom').animate(PREVIEW_IN, speed);
    $('.zoom img').animate(
      {width: zDims.width, height: zDims.height},
      speed
    );
  }
}

/**
 *
 */
function unzoomImage() {
  var speed = 'fast';
  $('.zoom img').animate({width: 0, height: 0}, speed);
  $('.zoom').animate(PREVIEW_OUT, speed, function() {
    $('body').removeClass('preview');
  });
}

/**
 * Placeholder function
 */
function displayNextPhoto() {
  // TODO: disable map interaction
  photo = getPhoto(topCountriesList);
  getCountryClues(photo).then(function(data) {
    clues = data;
    console.dir(clues.query.pages);
  });
  placePhoto(photo.url);
  $('.hints ul').children().remove();
  $('.details').text('');
  // TODO: re-enable map interaction
}

/**
 * TODO
 */
function askPlayAgain() {
  if (confirm('Play again?')) {
    roundNumber = 1;
    displayNextPhoto();
  }

  resetMap(); // eslint-disable-line no-undef
}

/**
 * Primary game interaction
 */
function handleLocationClick(clickCoord) {
  var actualCoord = photo.coordinate;
  linkPoints(actualCoord, clickCoord);

  var distance = milesBetweenPoints(photo.coordinate, clickCoord);

  $('.details').html([
    'Actual: ' + photo.coordinate.latitude,
    'Guess: ' + clickCoord.latitude,
    'Distance: ' + distance
  ].join('<br>'));

  ++roundNumber;
  if (roundNumber > TOTAL_ROUNDS) {
    window.setTimeout(askPlayAgain, 1000);
  } else {
    displayNextPhoto();
  }
}

/**
 *
 */
function giveHint() {
  var $li = $('<li>').text('Flag: ');
  $li.append($('<img>').attr('src', stripUrlFromJson(clues)));
  $('.hints ul').append($li);
}

/**
 * main
 */
$().ready(function() {
  roundNumber = 1;
  topCountriesList = getTopCountriesList();
  displayNextPhoto();
  initializeMap(handleLocationClick); // eslint-disable-line no-undef
  $('button').on('click', giveHint);
  $('.photo img').on('dblclick', zoomImage);
  $('.overlay, .zoom').on('click', unzoomImage);
});
