var cached_styles = {}

function ol4pgmLayer(options) {
  this.options = options;

  this.source = new ol.source.TileVector({
    format: new ol.format.GeoJSON({
    }),
    url: this.options.url,
    tileGrid: new ol.tilegrid.XYZ({
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      extent: this.options.extent,
      tileSize: this.options.tileSize
    }),
  });

  this.layer = new ol.layer.Vector({
    source: this.source,
    style: this.styleFunction.bind(this)
  });
}

function get_style(type, params) {
  var id = type;
  for (var k in params) {
    id += "|"+ k + "|" + params[k];
  }

  if (!cached_styles[id]) {
    if (type == 'stroke')
      cached_styles[id] = new ol.style.Stroke(params);
    if (type == 'fill')
      cached_styles[id] = new ol.style.Fill(params);
  }

  return cached_styles[id];
}

ol4pgmLayer.prototype.styleFunction = function(feature, resolution) {
  styles = [];

  if(!feature.get("results"))
    return [];

  for(i = 0; i < feature.get("results").length; i++) {
    result = feature.get("results")[i]

    // style-element "fill"
    if(result['fill-color']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['fill-layer'] || result['layer']) * 100000 + 00000 + parseFloat(result['fill-z-index'] || result['z-index']),
        "fill": get_style('fill', {
          "color": result['fill-color']
      })}));
    }

    // style-element "casing"
    if(result['casing-width']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['casing-layer'] || result['layer']) * 100000 + 10000 + parseFloat(result['casing-z-index'] || result['z-index']),
        "stroke": get_style('stroke', {
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
        "stroke": get_style('stroke', {
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
          "fill": get_style('fill', {
            color: result['text-color']
          }),
          "stroke": get_style('stroke', {
            color: result['text-halo-color'],
            width: parseFloat(result['text-halo-radius']) * 3,
          })
      })}));
    }
  }

  return styles;
}

// from https://groups.google.com/forum/#!topic/ol3-dev/YWJHcKC6-O8
function map_click(e) {
  return;
  var pixel = map.getEventPixel(e.originalEvent);

  var feature_list = [];

  map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    if (layer.get("visible") == true){ // Is the current layer visible ?
      var id = feature.getProperties()['osm:id'];

      if(!feature_list[id])
        feature_list.push(id);
    }
  });

  alert(JSON.stringify(feature_list));
}
