'use strict';

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
  initializeMap(locationClickHandler); // eslint-disable-line no-undef
});
