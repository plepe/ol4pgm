<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="http://openlayers.org/en/v3.0.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="ol4pgm.css" type="text/css">
    <style>
      .map {
        height: 400px;
        width: 100%;
      }
    </style>
    <script src="http://openlayers.org/en/v3.0.0/build/ol.js" type="text/javascript"></script>
    <script type="text/javascript">
var param = "";
<?php
if(isset($_REQUEST['lang']))
  print "param += \"&lang=".$_REQUEST['lang']."\";\n";
?>
    </script>
    <title>OpenLayers 3 for pgmapcss example</title>
  </head>
  <body>
    <h2>My Map</h2>
    <div id="map" class="map"></div>
    <script type="text/javascript" src="index.js"></script>
    <script type="text/javascript" src="ol4pgm.js"></script>
  </body>
</html>
