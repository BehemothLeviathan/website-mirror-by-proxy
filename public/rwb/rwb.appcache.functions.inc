<?php
require_once('info.php');
function rwb_appcache_comment()
{
    header('Cache-Control: max-age=0');
    header('Content-type: text/cache-manifest');
    $hash = RWB_APPCACHE_HASH;
    if(!isset($_GET['hash']) || $_GET['hash'] != $hash) {
        print round(time() / 100);
    } else {
        print $hash;
    }
}

