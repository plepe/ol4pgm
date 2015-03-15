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
  this.map.on('singleclick', this.map_click.bind(this));

  // create popup template
  this.overlay_div = document.createElement("div");
  this.overlay_div.className = "ol4pgm-popup";

  var closer = document.createElement("a");
  closer.className = "ol4pgm-popup-closer";
  closer.href = "#";
  this.overlay_div.appendChild(closer);

  closer.onclick = function(closer) {
    this.overlay_div.style.display = "none";
    closer.blur();
    return false;
  }.bind(this, closer);

  this.overlay_content = document.createElement("div");
  this.overlay_content.className = "content";
  this.overlay_div.appendChild(this.overlay_content);

  this.overlay = new ol.Overlay({
    element: this.overlay_div
  });

  this.map.addOverlay(this.overlay);
}

ol4pgmLayer.prototype.getFeaturesInExtent = function(bbox=null) {
  var ret = [];

  if(!bbox)
    bbox = this.map.getView().calculateExtent(map.getSize());

  // TODO: this.source.forEachFeature ??? (does not work)
  var all_features = this.source.getFeatures();
  for(var i=0; i<all_features.length; i++) {
    if(all_features[i].getGeometry().intersectsExtent(bbox))
      ret.push(all_features[i]);
  }

  return ret;
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
ol4pgmLayer.prototype.map_click = function(e) {
  var popup_txt = '';
  var pixel = this.map.getEventPixel(e.originalEvent);

  var feature_list = [];

  this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    // Is the layer me and am I visible ?
    if ((layer == this.layer) && (layer.get("visible") == true)) {
      if (feature.getProperties()['results']) {
        for (var i=0; i<feature.getProperties()['results'].length; i++) {
          var result = feature.getProperties()['results'][i];

          if((result['popup-title']) || (result['popup-body'])) {
            if(result['popup-title'])
              popup_txt += '<div class="title">' + result['popup-title'] + '</div>';

            if(result['popup-body'])
              popup_txt += '<div class="body">' + result['popup-body'] + '</div>';
          }
        }
      }
    }
  }.bind(this));

  if(popup_txt != '') {
    this.overlay_content.innerHTML = popup_txt;
    this.overlay_div.style.display = "block";
    this.overlay_content.scrollTop = 0;
    this.overlay.setPosition(e.coordinate);
  }
}
