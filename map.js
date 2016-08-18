'use strict';
// stupid linter tricks
/* global ol */
var olMap;

/**
 * Places the point on the map
 *
 * @param ol.Map
 * @param {lat:, lng:} coords
 */
function placePoint(coords) {
  var layer = olMap.getLayers().getArray()[1];
  var point = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([coords.lng, coords.lat])
    )
  });

  var style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 3,
      fill: new ol.style.Fill({
        color: 'orange'
      })
    })
  });

  point.setStyle(style);

  var source = new ol.source.Vector({
    features: [point]
  });

  layer.setSource(source);
}

/**
 * Insert the map.
 *
 * @param clickHandler - function to call back with coordinates
 */
function initializeMap(clickHandler) { // eslint-disable-line no-unused-vars
  $('body').addClass('mapped');
  $('#map').children().remove();

  olMap = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Vector({
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 1
    })
  });

  olMap.on(
    'click',
    function(event) {
      var coordArray = ol.proj.transform(
        event.coordinate,
        'EPSG:3857',
        'EPSG:4326'
      );
      var coordObj = {lat: coordArray[1], lng: coordArray[0]};
      placePoint(coordObj);
      clickHandler(coordObj);
    }
  );
}
