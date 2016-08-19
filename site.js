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
  console.log('LatLng: ' + latLng.lat + ', ' + latLng.lng);
}

/**
 * main
 */
$().ready(function() {
  var topCountriesList = getTopCountriesList();
  var photo = getPhoto(topCountriesList);
  initializeMap(locationClickHandler); // eslint-disable-line no-undef
  placePhoto(photo.url);

  $('.photo img').on('dblclick', function(e) {
    var cls = e.currentTarget.className ? '' : 'zoom';
    e.currentTarget.className = cls;
  });
});


//// Test features ////
// function dum
