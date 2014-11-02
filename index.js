var map;

function init() {
  layer = new ol4pgmLayer({
    url: "test.cgi?x={x}&y={y}&z={z}&tilesize=1024&srs=3857",
    maxZoom: 17,
    tileSize: 1024
  });

  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer.layer
    ],
    view: new ol.View({
      center: ol.proj.transform([16.41, 48.20], 'EPSG:4326', 'EPSG:3857'),
      zoom: 16
    })
  });
}

window.onload = init;
