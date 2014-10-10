```js
new ol4pgmLayer(options)
```

Parameter `options`:

Name | Description
-----|-----------------
url  | URL template. Must include {x}, {y} or {-y} and {z}, e.g. "style.cgi?x={x}&y={y}&zoom={z}&tilesize=1024&srs=3857". see ol.source.TileVector for details.
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
