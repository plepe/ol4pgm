var map;

function init() {
  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.transform([map_location.lon, map_location.lat], 'EPSG:4326', 'EPSG:3857'),
      zoom: map_location.zoom
    })
  });

  layer = new ol4pgmLayer({
    url: cgi_url + param,
    maxZoom: 17,
    tileSize: 1024
  }, map);

  map.on('moveend', function() {
    var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    var zoom = map.getView().getZoom();

    history.replaceState(null, null, "?lon=" + center[0].toFixed(5) + "&lat=" + center[1].toFixed(5) + "&zoom=" + zoom);

  }.bind(layer));
}

window.onload = init;
