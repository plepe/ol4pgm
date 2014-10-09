var map;

function init() {
  tile_source = new ol.source.TileVector({
    format: new ol.format.GeoJSON({
    }),
    url: "/test.cgi?x={x}&y={y}&zoom={z}&tilesize=1024&srs=3857",
    tileGrid: new ol.tilegrid.XYZ({
      maxZoom: 17,
      tileSize: 1024
    }),
  });

  vector_layer = new ol.layer.Vector({
    source: tile_source
  });

  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vector_layer
    ],
    view: new ol.View({
      center: ol.proj.transform([16.41, 48.20], 'EPSG:4326', 'EPSG:3857'),
      zoom: 16
    })
  });
}

window.onload = init;
