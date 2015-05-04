Usage Example
=============
Compile mapcss stylesheet
```sh
pgmapcss --mode standalone -tol4pgm-0.1 test.mapcss
```

In your JavaScript, load map and layer:
```js
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'sat'})
    })
  ],
  view: new ol.View({
    center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});
var layer = new ol4pgmLayer({
  url: 'test.py?x={x}&y={y}&zoom={z}&tilesize=1024&srs=3857'
}, map);
```

Parameter `options`
===================

Name | Description
-----|-----------------
url  | URL template. Must include {x}, {y} or {-y} and {z}, e.g. "style.cgi?x={x}&y={y}&zoom={z}&tilesize=1024&srs=3857". see ol.source.TileVector for details.
single_url | URL template for requests for features with specified ID (see function getFeature() for details). Must include {id} and can include {zoom} (which is the current zoom level for tile size 256px), e.g. "style.cgi?id={id}&zoom={zoom}&srs=3857"
attributions | ol.source.TileVector -> attributions
defaultProjection | ol.source.TileVector -> defaultProjection
format | ol.source.TileVector -> format
logo | ol.source.TileVector -> logo
object | ol.source.TileVector -> object
projection | ol.source.TileVector -> projection
tileGrid | ol.source.TileVector -> tileGrid
tileUrlFunction | ol.source.TileVector -> tileUrlFunction
urls | ol.source.TileVector -> urls
defaultDataProjection | ol.format.GeoJSON -> defaultDataProjection
geometryName | ol.source.GeoJSON -> geometryName
minZoom | ol.tilegrid.XYZ -> minZoom
maxZoom | ol.tilegrid.XYZ -> maxZoom
extent | ol.tilegrid.XYZ -> extent
tileSize | ol.tilegrid.XYZ -> tileSize
visible | visibility of layer (default: true)

Functions
=========

Function | Parameters | Return value | Description
---------|------------|--------------|-------------
setVisible(visible) | visible: boolean, whether layer should be shown | none | set visibility of the layer
getVisible() | | return true when layer is visible | return visibility of the layer
getFeatures() | | list of features | returns list of loaded vector features
getFeature(id, callback) | id: an OSM ID e.g. 'n1234'; callback: a function which will be called with the feature as paramter (or null, when object does not exist) | feature | Get the specified map feature. If the map feature is not loaded yet, an AJAX request to the single_url will be made to load the map feature.
getFeaturesInExtent(bbox) | bbox: a ol3 extent | list of features | returns list of vector features which intersect the specified extent.
featuresAtPixel(pixel) | pixel: an ol3 pixel | list of features | returns list of vector features which are at the specified pixel
