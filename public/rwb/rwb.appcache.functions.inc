<?php
require_once('info.php');
function rwb_appcache_comment()
{
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Access-Control-Allow-Origin: *'); # For JS to ping
    header('Content-type: text/cache-manifest');
    header('Pragma: no-cache'); // HTTP 1.0.
    header('Expires: 0'); // Proxies.
    $hash = rwb_appcache_get_hash();
    echo $hash;
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



