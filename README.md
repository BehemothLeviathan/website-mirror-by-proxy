Website-mirror-by-proxy is a server-side web proxy designed to host one or multiple dynamic mirror versions of any website. It is based on https://github.com/greatfire/redirect-when-blocked (the full edition). Whereas redirect-when-blocked requires the source/origin website to be modifed, website-mirror-by-proxy runs separately and does not need any modification of the source/origin website.

## How to set up
1. Install the required dependencies. If you are using Ubuntu or a similar OS you can use the install.sh script. Otherwise, manually install/enable Apache, the Apache rewrite module, PHP and the PHP HTTP extension (http://php.net/manual/en/book.http.php). It has to be version 1 of the HTTP extension since version 2 is not backward compatible. The specific version used in the install script and which this project has been tested successfully on is pecl_http-1.7.6.
2. Copy conf-local-template.inc to conf-local.inc.
3. In the conf-local.inc file, add the Conf::$default_upstream_base_url that you want to proxy. The URL should be formatted like this: scheme://domain, without any trailing slash or path. Example: http://example.com.
4. Run `php public/rwb/build.php` to generate `public/rwb/info.php`. If you want to debug appcache,you need to change `define('DEBUG',false)` to `define('DEBUG',true)` in `public/rwb/info.php` so the appcache hash will refresh on source code changed.
5. Make sure that Apache is parsing .htaccess files in the site directory (eg "AllowOverride All").
6. Add a list of one or more URLs where the site can be accessed to public/rwb/conf/alt_base_urls.txt. Each URL should include a trailing slash (eg http://localhost/website-mirror-by-proxy/public/ or http://example.com/).
7. Optionally add a list of one or more third-party URLs, where the user should be redirected to if all of the mirror URLs fail, to public/rwb/conf/alt_url_collections.txt.
8. Access the site...

There are many configuration settings, some of which are used by default in the 'main.inc' file. The static classes in the filters directory can be used to fix broken URL rewrites (usually because of URLs generated in javascript) and to proxy URLs on third-party hosts.

## Other platforms
This project could run on older versions of PHP, without the HTTP Extension, by replacing the HttpRequest, HTTPMessage etc with other compatible classes. It could run on servers other than Apache by adapting the .htaccess/rewrite functionality. It could also be wholly ported to a non-PHP environemnt, though such an initiative should probably start by porting redirect-when-blocked itself first.

## Contributions
.. are very welcome, as is feedback. Feel free to open issues and to contribute improvements. 我们正在招聘开发者来改进此项目，具体请见 https://github.com/greatfire/wiki/wiki#%E6%8B%9B%E8%81%98
