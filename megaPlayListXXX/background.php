<?php
header("Content-type: text/javascript");

//jQuery 1.7.2
$file = file_get_contents('resources.background/assets/jquery.1.7.2.js', true);
echo $file;

echo "\n\n\n\n";

//base class
$file = file_get_contents('resources.background/assets/base.class.js', true);
echo $file;

echo "\n\n\n\n";

//config
$file = file_get_contents('resources.background/playlist.config.js', true);
echo $file;

echo "\n\n\n\n";

//database
$file = file_get_contents('resources.background/playlist.database.js', true);
echo $file;

echo "\n\n\n\n";

//router
$file = file_get_contents('resources.background/playlist.router.js', true);
echo $file;

echo "\n\n\n\n";

//global object
$file = file_get_contents('resources.background/playlist.global.js', true);
echo $file;

echo "\n\n\n\n";

//playlist background
$file = file_get_contents('resources.background/playlist.background.js', true);
echo $file;
?>