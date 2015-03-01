(function (G) {

if (top!=self) {
  top.location=self.location;
  return;
}

var env=G._RWB_ENV_,tip=document.getElementById("rwbTip_JUST_MAGIC_BIT"),
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
  var src=env.request_src;
  console.log(src);
  request(src,function (xhr) {//succ
    console.log("succ load:",xhr.readyState,xhr.status,src);
    var html=xhr.responseText;
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

    html=html.replace(/(<body[^>]*>)/i,"$1"+tip.outerHTML.replace(/^<div/i,'<div class="top"'));
    document.open();

    if (charset) {
      console.log("Charset:"+charset);
      document.characterSet=document.charset=charset; //firefox didn't buy this
    }

    document.write(html);
    document.close();
  },function () {//fail
    warn("Page load fail!");
  });
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
  if (env.alt_url_collections[0]) {
    //location.href=env.alt_url_collections[0];
  }
}

function warn(msg) {
  tip.innerHTML+='<div style="font-weight:bold;color:red;text-align:center;padding:1em;">'+encodeHTML(msg)+'</div>';
}


function request(url,succ,fail) {
  var xhr=new XMLHttpRequest(),tid;
  xhr.open("GET",url,true);
  xhr.overrideMimeType('text/html; charset='+env.upstream_charset);
  xhr.timeout=10000; // 10s
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
