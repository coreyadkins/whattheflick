'use strict';

if (!flickrAPI) {
  var flickrAPI = {};
}

if (!Promise) {
  var Promise = {};
}

var URL_STEM = 'https://api.flickr.com/services/rest/?';

/**
 * Pulls a list of the Top 100 Countries with Photos from Flickr API.
 */
function getTopCountriesList() {
  var request = $.ajax({
    data: {
      method: 'flickr.places.getTopPlacesList',
      api_key: flickrAPI,
      place_type_id: 12,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM,
    async: false
  });
  return JSON.parse(request.responseText);
}

/**
 * Pulls a list of places with public photos that are geotagged for the randomly
 * chosen country from the FlickrAPI. Returns an array that contains the list
 * as object as well as the name of the country.
 */
function getPlacesByCountry(topPlacesList) {
  var countryID = _.sample(topPlacesList.places.place);
  var country = countryID.woe_name;
  var request = $.ajax({
    data: {
      method: 'flickr.places.getChildrenWithPhotosPublic',
      api_key: flickrAPI,
      place_id: countryID.place_id,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM,
    async: false
  });
  var placesByCountry = JSON.parse(request.responseText);
  return [placesByCountry, country];
}

/**
 * Pulls all photos geotagged in the randomly chosen place from the FlickrAPI.
 * Returns and array that contains the photo list as well as the longitude and
 * latitude of the place.
 */
function getPhotosByPlace(placesByCountry) {
  var placeID = _.sample(placesByCountry.places.place);
  var request = $.ajax({
    data: {
      method: 'flickr.photos.search',
      api_key: flickrAPI,
      place_id: placeID.place_id,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM,
    async: false
  });
  return JSON.parse(request.responseText);
}

/**
 * Gets the coordinates for the given photo from flickr API
 */
function getPhotoLocation(photoId) {
  var request = $.ajax({
    data: {
      method: 'flickr.photos.geo.getLocation',
      api_key: flickrAPI,
      photo_id: photoId,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM,
    async: false
  });
  return JSON.parse(request.responseText);
}

/**
 * Picks a random photo from the list, then creates a URL to access the .jpg of
 * the photo.
 */
function getPhotoLocAndURL(photosByPlace) {
  var photo = _.sample(photosByPlace.photos.photo);
  var photoLocation = getPhotoLocation(photo.id);
  var photoLat = photoLocation.photo.location.latitude;
  var photoLon = photoLocation.photo.location.longitude;
  var photoURL = ['https://farm' + photo.farm + '.staticflickr.com/' +
  photo.server + '/'  + photo.id + '_' + photo.secret + '.jpg'].join('');
  return [photoURL, photoLat, photoLon];
}


/**
 * Generates desired object from gathered data.
 */
function getPhotoObject(photoURL, country, photoLat, photoLon) {
  return {url: photoURL, lat: photoLat, lon: photoLon, country: country};
}

/**
 * Main function- grabs a random photo off Flickr API with its location
 * coordinates, and the country it was taken in.
 */

function getPhoto() {
  var topCountriesList = getTopCountriesList();
  var placesByCountry = getPlacesByCountry(topCountriesList);
  if (placesByCountry[0].places.place.length === 0) {
    var newTopCountriesList = getTopCountriesList();
    var placesByCountry = getPlacesByCountry(newTopCountriesList);
  }
  var photosByPlace = getPhotosByPlace(placesByCountry[0]);
  var photoLocAndURL = getPhotoLocAndURL(photosByPlace);
  return getPhotoObject(photoLocAndURL[0], placesByCountry[1],
    photoLocAndURL[1], photoLocAndURL[2]);
}

var test = getPhoto();
console.log(test);
