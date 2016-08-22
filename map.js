'use strict';
// stupid linter tricks
/* global ol */
var olMap;

/**
 * Coordinate object
 *
 * Normalizes data
 * Provides transformation(s)
 *
 * @param {ol.MapEvent.coordinate|Number} - ol.MapEvent.coordinate or latitude
 * @param {Number=} longitude
 */
function Coordinate() {
  var lonLat;

  if (arguments.length < 2) {
    lonLat = this._initCoordinate(arguments[0]);
  } else {
    lonLat = this._initLatLng(arguments[0], arguments[1]);
  }

  // OpenLayers provides silly values when the map is panned
  // longitude 181 instead of -179, longitude 1081 instead of 1, etc.
  this.latitude = this.getRealLatitude(lonLat[1]);
  this.longitude = this.getRealLongitude(lonLat[0]);
  this.projection = this.getProjection(this.latitude, this.longitude);
}

var coordinateProto = {
  getProjection: function(latitude, longitude) {
    return ol.proj.fromLonLat([longitude, latitude]);
  },
  _initCoordinate: function(coord) {
    return ol.proj.transform(
      coord,
      'EPSG:3857',
      'EPSG:4326'
    );
  },
  _initLatLng: function(lat, lng) {
    return [Number(lng), Number(lat)];
  },
  _wrapBounds: function(num, bound) {
    var tempNum = num % (bound * 2);
    var realNum = tempNum;

    if (Math.abs(tempNum) >= bound) {
      if (tempNum < 0) {
        realNum += bound;
      } else {
        realNum -= bound;
      }
    }

    return realNum;
  },
  getRealLatitude: function(num) {
    return this._wrapBounds(num, 90);
  },
  getRealLongitude: function(num) {
    return this._wrapBounds(num, 180);
  }
};

Coordinate.prototype = coordinateProto;

/**
 * Clear all layers except map tile
 */
function resetMap() { // eslint-disable-line no-unused-vars

  // cannot remove in-place with this iterator
  var gameLayers = [];
  olMap.getLayers().forEach(function(elm, index, arr) { // eslint-disable-line no-unused-vars
    if (elm.get('type') === 'game') {
      gameLayers.push(elm);
    }
  });

  _.forEach(gameLayers, function(layer) {
    olMap.removeLayer(layer);
  });
}


/**
 * Create a point feature
 *
 * @param latLng {lat: Y, lng: X}
 * @param color {string} - CSS color
 * @param pointSize {number}
 *
 * @return ol.Feature(ol.geom.Point)
 */
function createFeature(coord, color, pointSize) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coord.projection),
  });

  feature.setStyle(new ol.style.Style({image: new ol.style.Circle({
    radius: pointSize,
    fill: new ol.style.Fill({
      'color': color
    })
  })}));

  return feature;
}

/**
 * A feature between two points
 *
 * @param {latLng} point1
 * @param {latLng} point2
 *
 * return ol.Feature
 */
function connectCoords(coords) {
  var points = _.map(coords, function(coord) {
    return coord.projection;
  });

  var lineFeat = new ol.Feature({
    geometry: new ol.geom.LineString(points),
    style: new ol.style.Style({
      fill: new ol.style.Fill({color: '#00FF00', weight: 0}),
      stroke: new ol.style.Stroke({
        color: '#00FF00',
        width: 2,
        lineDash: [2, 1],
        lineCap: 'butt'
      }),
    }),
  });

  return lineFeat;
}

/**
 * Places the point on the map
 *
 * @param ol.Map
 * @param {lat:, lng:} coords
 */
function linkPoints(actual, guess) { // eslint-disable-line no-unused-vars
  var source = new ol.source.Vector({
    features: [
      connectCoords([actual, guess]),
      createFeature(actual, '#0f0', 5),
      createFeature(guess, 'orange', 3),
    ],
  });

  var layer = new ol.layer.Vector({'source': source, type: 'game'});
  olMap.addLayer(layer);
}

/**
 * Insert the map.
 *
 * @param clickHandler - function to call back with coordinates
 */
function initializeMap(clickHandler) { // eslint-disable-line no-unused-vars
  $('body').addClass('mapped');
  $('#map').children().remove();
  // return;
  var centerPoint = new Coordinate(0, 0);

  olMap = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        type: 'tile',
      })
    ],
    view: new ol.View({
      center: centerPoint.projection,
      zoom: 1
    })
  });

  olMap.on(
    'click',
    function(event) {
      var coord = new Coordinate(event.coordinate);
      clickHandler(coord);
    }
  );
}
