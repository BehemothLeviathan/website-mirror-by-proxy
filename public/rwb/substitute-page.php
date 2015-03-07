<!DOCTYPE html>
<html manifest="<?php print $rwb_path_relative_to_request_path ?>/rwb.appcache?hash=<?php echo $env['rwb_hash'] ?>">
<head>
<meta charset="<?php echo $env['upstream_charset']; ?>" />
<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $env['upstream_charset']; ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
<title><?php print iconv('utf-8',$env['upstream_charset'],self::$website_title) ?></title>
</head>
<body>
  <div id="rwbTip_JUST_MAGIC_BIT">
    <style>
      #rwbTip_JUST_MAGIC_BIT div * {
        margin:0;
        padding:0;
      }
      #rwbTip_JUST_MAGIC_BIT p {
        text-align: center;
      }
      #rwbTip_JUST_MAGIC_BIT ul {
        border: thin solid #ddd;
        margin: auto;
        padding: 5px;
        width: 400px;
      }
      #rwbTip_JUST_MAGIC_BIT li {
        margin-left: 50px;
      }
      #rwbTip_JUST_MAGIC_BIT h1 {
        color: #aaa;
        text-align: center;
      }
      #rwbTip_JUST_MAGIC_BIT.top {
        color: #222;
        padding: 5px;
        text-align: center;
        background:white;
      }
      #rwbTip_JUST_MAGIC_BIT.top div * {
        display:inline;
        font-size:12px;
      }
      #rwbTip_JUST_MAGIC_BIT.top div .title {
        display:none;
      }
      #rwbTip_JUST_MAGIC_BIT.top div ul {
        border:none;
        padding:0;
      }
      #rwbTip_JUST_MAGIC_BIT.top div ul li {
        margin:0;
      }
      #rwbTip_JUST_MAGIC_BIT.top div ul li:first-child::after {
        content:",";
      }
    </style>
    <div>
      <p class="title"><?php print RedirectWhenBlockedFull::$translatable_text['loading'] ?></p>
      <h1 class="title"><?php print iconv('utf-8',$env['upstream_charset'],self::$website_title) ?></h1>
      <p><?php print RedirectWhenBlockedFull::$translatable_text['if_website_fails'] ?></p>
      <?php if(self::$alt_url_collections) { ?>
      <ul>
        <?php foreach(self::$alt_url_collections as $alt_url_collection) { ?>
        <li><a href="<?php print $alt_url_collection; ?>" target="_blank"><?php print $alt_url_collection; ?></a></li>
        <?php } ?>
      </ul>
      <?php } ?>
    </div>
  </div>
  <script>
    var _RWB_ENV_=<?php echo json_encode($env);?>;
  </script>
  <script>
    <?php echo  file_get_contents(__DIR__ . '/main.js') ; ?>
  </script>
  <?php print self::$html_body_appendix ?>
</body>
</html>
