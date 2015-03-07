<?php
require_once('info.php');
function rwb_appcache_comment()
{
    # If set Cache-Control:no-cache,firefox will ignore appcache
    header('Cache-Control: max-age=0');
    header('Access-Control-Allow-Origin: *'); # For JS to ping
    header('Content-type: text/cache-manifest');
    $hash = rwb_appcache_get_hash();
    if(!isset($_GET['hash']) || $_GET['hash'] != $hash) {
        print round(time() / 100);
    } else {
        print $hash;
    }
}

function rwb_appcache_get_hash() {
  if (defined('DEBUG') && DEBUG) { // return fresh hash if on debug
    return rwb_appcache_calc_hash();
  } else {
    return RWB_APPCACHE_HASH;
  }
}

function rwb_appcache_calc_hash() {
    $str = '';
    foreach (array(
        __DIR__,
        __DIR__ . '/conf'
    ) as $dir) {
        foreach (scandir($dir) as $file) {
            $str .= md5_file($dir . '/' . $file);
        }
    }
    return md5($str);
}



