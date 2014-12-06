var cached_styles = {}

function ol4pgmLayer(options, map) {
  this.options = options;

  this.source = new ol.source.TileVector({
    url: this.options.url,
    attributions: this.options.attributions,
    defaultProjection: this.options.defaultProjection,
    format: this.options.format,
    logo: this.options.logo,
    object: this.options.object,
    projection: this.options.projection,
    tileGrid: this.options.tileGrid,
    tileUrlFunction: this.options.tileUrlFunction,
    urls: this.options.urls,
    format: new ol.format.GeoJSON({
      defaultDataProjection: this.options.defaultDataProjection,
      geometryName: this.options.geometryName
    }),
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

  this.map = map;

  this.map.addLayer(this.layer);
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
    if((result['width']) && (result['casing-dashes-background-color'])) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['line-layer'] || result['layer']) * 100000 + 30000 + parseFloat(result['line-z-index'] || result['z-index']),
        "stroke": get_style('stroke', {
          "color": result['casing-dashes-background-color'],
          "width": result['final-casing-width'],
          "lineCap": result['casing-linecap'],
          "lineJoin": result['casing-linejoin'],
          "miterLimit": result['casing-miterlimit']
      })}));
    }
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
    if((result['width']) && (result['dashes-background-color'])) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['line-layer'] || result['layer']) * 100000 + 30000 + parseFloat(result['line-z-index'] || result['z-index']),
        "stroke": get_style('stroke', {
          "color": result['dashes-background-color'],
          "width": result['width'],
          "lineCap": result['linecap'],
          "lineJoin": result['linejoin'],
          "miterLimit": result['miterlimit']
      })}));
    }
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

    // style-element "point"
    if(result['final-icon-image']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['point-layer'] || result['layer']) * 400000 + 30000 + parseFloat(result['point-z-index'] || result['z-index']),
        "image": new ol.style.Icon({
          "src": escape(result['final-icon-image']),
          "rotation": parseFloat(result['icon-rotation']) * (Math.PI / 180.0)
      })}));
    }

    if(result['final-symbol-image']) {
      styles.push(new ol.style.Style({
        "zIndex": parseFloat(result['point-layer'] || result['layer']) * 400000 + 30000 + parseFloat(result['point-z-index'] || result['z-index']),
        "image": new ol.style.Icon({
          "src": escape(result['final-symbol-image']),
          "rotation": parseFloat(result['symbol-rotation']) * (Math.PI / 180.0)
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
          "textAlign": result['text-anchor-horizontal'] == "middle" ? "center" : result['text-anchor-horizontal'],
          "textBaseline": (parseFloat(result['text-offset']) > 0 ? "top" :
                          (parseFloat(result['text-offset']) < 0 ? "bottom" :
                           "middle")),
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
