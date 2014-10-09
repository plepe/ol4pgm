var map;

function styleFunction(feature, resolution) {
  styles = [];

  if(!feature.get("results"))
    return [];

  for(i = 0; i < feature.get("results").length; i++) {
    result = feature.get("results")[i]

    // style-element "fill"
    if(result['fill-color']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['fill-layer'] || result['layer']) * 100000 + 00000 + parseFloat(result['fill-z-index'] || result['z-index']),
        "fill": new ol.style.Fill({
          "color": result['fill-color']
      })}));
    }

    // style-element "casing"
    if(result['casing-width']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['casing-layer'] || result['layer']) * 100000 + 10000 + parseFloat(result['casing-z-index'] || result['z-index']),
        "stroke": new ol.style.Stroke({
          "color": result['casing-color'],
          "width": result['final-casing-width'],
          "lineCap": result['casing-linecap'],
          "lineJoin": result['casing-linejoin'],
          "lineDash": (result['casing-dashes'] == "none") ? null : result['casing-dashes'].split(","),
          "miterLimit": result['casing-miterlimit']
      })}));
    }

    // style-element "line"
    if(result['width']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['line-layer'] || result['layer']) * 100000 + 30000 + parseFloat(result['line-z-index'] || result['z-index']),
        "stroke": new ol.style.Stroke({
          "color": result['color'],
          "width": result['width'],
          "lineCap": result['linecap'],
          "lineJoin": result['linejoin'],
          "lineDash": (result['dashes'] == "none") ? null : result['dashes'].split(","),
          "miterLimit": result['miterlimit']
      })}));
    }

    // style-element "point-text"
    if(result['text']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['point-text-layer'] || result['layer']) * 500000 + 30000 + parseFloat(result['point-text-z-index'] || result['z-index']),
        "text": new ol.style.Text({
          "text": result['text'],
          "font": result['font-size'] + "px " + result['font-family'],
          "offsetY": result['text-offset'],
          "textAlign": result['text-position'],
          "fill": new ol.style.Stroke({
            color: result['text-color']
          }),
          "stroke": new ol.style.Stroke({
            color: result['text-halo-color'],
            width: parseFloat(result['text-halo-radius']) * 3,
          })
      })}));
    }
  }

  return styles;
}

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
    source: tile_source,
    style: styleFunction
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
