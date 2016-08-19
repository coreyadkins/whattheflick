'use strict';

if (!flickrAPI) {
  var flickrAPI = {};
}

if (!Promise) {
  var Promise = {};
}

var URL_STEM = 'https://api.flickr.com/services/rest/?';

function getTopCountriesList() {
  return $.ajax({
    data: {
      method: 'flickr.places.getTopPlacesList',
      api_key: flickrAPI,
      place_type_id: 12,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM
  });
}

function getPlacesByCountry(topPlacesList) {
  var countryID = _.sample(topPlacesList.places.place);
  var country = countryID.woe_name;
  var placesByCountry = $.ajax({
    data: {
      method: 'flickr.places.getChildrenWithPhotosPublic',
      api_key: flickrAPI,
      place_id: countryID.place_id,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM
  });
  return [placesByCountry, country];
}

function getPhotosByPlace(placesByCountry) {
  var placeID = _.sample(placesByCountry.places.place);
  var photoLat = placeID.latitude;
  var photoLon = placeID.longitude;
  var photosByPlace = $.ajax({
    data: {
      method: 'flickr.photos.search',
      api_key: flickrAPI,
      place_id: placeID.place_id,
      format: 'json',
      nojsoncallback: 1
    },
    dataType: 'json',
    url: URL_STEM
  });
  return [photosByPlace, photoLat, photoLon];
}

function getPhotoURL(photosByPlace) {
  var photo = _.sample(photosByPlace.photos.photo);
  return ['https://farm' + photo.farm + '.staticflickr.com/' +
  photo.server + '/'  + photo.id + '_' + photo.secret + '.jpg'].join('');
}

function getPhotoObject(photoURL, country, photoLat, photoLon) {
  return {url: photoURL, lat: photoLat, lon: photoLon, country: country};
}

function getPhoto() {
  var topCountriesList = getTopCountriesList;
  var placesByCountry = getPlacesByCountry(topCountriesList);
  var country = placesByCountry[1];
  var photosByPlace = getPhotosByPlace(placesByCountry[0]);
  var photoLat = photosByPlace[1];
  var photoLon = photosByPlace[2];
  var photoURL = getPhotoURL(photosByPlace[0]);
  return getPhotoObject(photoURL, country, photoLat, photoLon);
}

getPhoto();
