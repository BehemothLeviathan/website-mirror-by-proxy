(function (G) {
if (top!=self) {
  top.location=self.location;
  return;
}

var DEFAULT_TIMEOUT=30000; // default timeout is 30000ms,viz. 30s

if (!G.console) {
  G.console={
    log:function () {
      //var msgs=[].slice.apply(arguments).join("\n");
      //alert(msgs);
    }
  };
}

var env=G._RWB_ENV_,
    RWB_NAME_PREFIX="rwbTip_JUST_MAGIC_BIT",
    tip=document.getElementById(RWB_NAME_PREFIX),
    warningElm=document.getElementById(RWB_NAME_PREFIX+'_warning'),
    manifest=document.documentElement.getAttribute("manifest"),
    urls=env.alt_base_urls,base_url='',relative_url='';
    _plain_div=document.createElement("div");

console.log("Checker Working!");

function encodeHTML(text) {
  var t=document.createTextNode(text);
  _plain_div.innerHTML='';
  _plain_div.appendChild(t);
  return _plain_div.innerHTML;
}

function startsWith(s,prefix){
  return s.lastIndexOf(prefix, 0) === 0;
}

function requestPage() {
  var cb=env.jsonp_callback_basename+(+new Date);
  var src=env.request_src+'&callback='+cb;
  var script=document.createElement('script');
  var tid=setTimeout(onTimeout,DEFAULT_TIMEOUT);
  G[cb]=function (result) {
    clearTimeout(tid);
    console.log("OK:",src);
    script.parentNode.removeChild(script);
    setTimeout(function () { // IE8 need to take a breath
      var html=result.html;
      html=html.replace(/(<body[^>]*>)/i,"$1"+tip.outerHTML.replace(/^\s*<div/i,'<div class="top"'));
      document.open();
      document.charset=env.upstream_charset; // only for IE8
      document.write(html);
    },0);
  };


  script.charset='utf-8';
  script.src=src;
  script.onerror=function () {
    console.log("JSONP Error!");
  };
  document.getElementsByTagName('head')[0].appendChild(script);
  function onTimeout() {
    G[cb]=noop;
    warn("Page load timeout!");
    warn("Trying other mirrors...Please wait...");
    testOtherMirrors();
  }


  /*
    var charset;
    var ct=xhr.getResponseHeader("Content-Type");
    if (ct) {
      charset=ct.match(/charset=([a-z0-9_-]+)/);
      charset=charset && charset[1];
    }
    if (!charset) {
      charset=html.match(/<head\b[^>]*>[^]*?<[^>]+charset=['"]?([a-z0-9-_]+)['"]?/i);
      charset=charset && charset[1];
    }

    if (charset) {
      console.log("Charset:"+charset);
      document.characterSet=document.charset=charset; //firefox didn't buy this
    }

  */
}

function chooseMirror(url,pingQueue) {
  chooseMirror=noop;
  pingQueue.forEach(function (xhr) { // only choose the fastest mirror
    xhr.abort();
  });
  location.replace(url + relative_url);
}

function noAvailableMirror() {
  console.log('%cEmergency!','color:red');
  warn("No available mirror!");
  warn("Redirecting to URL Collection page now...Please wait...");
  var urls=env.alt_url_collections,url,img;
  var urlCount=urls.length,ok=false;
  for (var i=0;i<urls.length;i++) {
    url=urls[i].replace(/^(https?:\/\/[^\/]+\/).*/,'$1')+'favicon.ico';
    img=new Image;
    img.onload=onLoad;
    img.onerror=onError;
    img.pageUrl=urls[i];
    img.src=url;
  }

  function onLoad() {
    if (ok) return;
    ok=true;
    location.href=this.pageUrl;
  }

  function onError() {
    if (ok) return;
    urlCount--;
    if (urlCount<=0) {
      warn("No available URL Collection page!");
    }
  }
}

function warn(msg) {
  warningElm.innerHTML+='<br />'+encodeHTML(msg).replace(/\n/g,'<br />');
}



function request(url,succ,fail) {
  var xhr=new XMLHttpRequest(),tid;
  xhr.open("GET",url,true);
  xhr.timeout=DEFAULT_TIMEOUT;
  xhr.onreadystatechange=function () {
    if (xhr.readyState===4 && xhr.status>=200 && xhr.status <400) {
      clean();
      succ(xhr);
    }
  };
  xhr.ontimeout=onTimeout;
  tid=setTimeout(onTimeout,xhr.timeout);
  xhr.send(null);
  return xhr;
  function onTimeout() {
    console.log("Timeout:"+url);
    clean();
    fail();
  }

  function clean() {
    xhr.onreadystatechange=noop;
    xhr.ontimeout=noop;
    clearTimeout(tid);
  }
}

function testOtherMirrors() {
  warn("Page load timeout!");
  warn("Trying other mirrors...Please wait...");
  if (!urls.length) return noAvailableMirror();
  var count=urls.length;
  var pingQueue=urls.map(function (url) {
    return request(url+manifest,function () {chooseMirror(url,pingQueue)},function () {
      console.log("Fail:"+url);
      count--;
      if (!count) noAvailableMirror();
    });
  });
}


function noop() {}



for (var i=0;i<urls.length;i++) {
  if (startsWith(location.href,urls[i])) {
    base_url=urls[i];
    relative_url=location.href.substring(base_url.length);
    urls.splice(i,1); // remove current mirror
    break;
  }
}

// If current mirror available,no need to test other mirror
// that may cause infinite redirect loop when mirror speed unstable
request(base_url+manifest+"?nocache"+(+new Date),requestPage,testOtherMirrors);



})(this);
