<?php
Header("Content-Type: text/html; charset=utf-8");
if(file_exists("conf.php"))
  include("conf.php");
else {
  print "Copy <tt>conf.php-dist</tt> to <tt>conf.php</tt> and adapt to your needs";
  exit;
}
?>
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="http://openlayers.org/en/v3.0.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="ol4pgm.css" type="text/css">
    <style>
      .map {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
    </style>
    <script src="http://openlayers.org/en/v3.0.0/build/ol.js" type="text/javascript"></script>
    <script type="text/javascript">
<?php
if($_REQUEST['lat'])
  $map_location['lat'] = (float)$_REQUEST['lat'];
if($_REQUEST['lon'])
  $map_location['lon'] = (float)$_REQUEST['lon'];
if($_REQUEST['lat'])
  $map_location['zoom'] = (int)$_REQUEST['zoom'];
print "var map_location = " . json_encode($map_location) . ";\n";
?>
var param = "";
<?php
if(isset($_REQUEST['lang']))
  print "param += \"&lang=".$_REQUEST['lang']."\";\n";
?>
    </script>
    <title><?php print $title; ?></title>
  </head>
  <body>
    <div id="map" class="map"></div>
    <script type="text/javascript" src="index.js"></script>
    <script type="text/javascript" src="ol4pgm.js"></script>
  </body>
</html>
