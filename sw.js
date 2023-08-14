var serviceWorkerOption = {
  "assets": [
    "/fonts/674f50d287a8c48dc19ba404d20fe713.eot",
    "/fonts/af7ae505a9eed503f8b8e6982036873e.woff2",
    "/fonts/fee66e712a8a08eef5805a46892932ad.woff",
    "/fonts/b06871f281fee6b241d60582ae9369b9.ttf",
    "/img/912ec66d7572ff821749319396470bde.svg",
    "/index.css",
    "/index.js",
    "/serviceWorker.js",
    "/worker.js",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/favicon-16x16.png",
    "/fontawesome_cursors/arrow-right.svg",
    "/fontawesome_cursors/circle.svg",
    "/favicon-32x32.png",
    "/index.html",
    "/favicon.svg",
    "/fontawesome_cursors/arrows-h.svg",
    "/fontawesome_cursors/remove.svg",
    "/questplay/frame-bottom.png",
    "/questplay/frame-left-top-2.png",
    "/questplay/frame-left-bottom.png",
    "/manifest.json",
    "/questplay/frame-left.png",
    "/questplay/frame-left-top.png",
    "/questplay/frame-left-bottom-2.png",
    "/questplay/background.jpg",
    "/questplay/frame-right-bottom-2.png",
    "/questplay/frame-right-bottom.png",
    "/questplay/frame-right-top-2.png",
    "/questplay/frame-right-top.png",
    "/questplay/frame-right.png",
    "/questplay/frame-top.png",
    "/questplay/frame.png",
    "/spacerangersquest/index.html"
  ]
};
        
        !function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){},function(e,t,n){"use strict";n.r(t);n(0);var r=function(e,t,n,r){return new(n||(n=Promise))((function(a,o){function s(e){try{c(r.next(e))}catch(e){o(e)}}function i(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}c((r=r.apply(e,t||[])).next())}))},a=function(e,t){var n,r,a,o,s={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function i(o){return function(i){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(a=s.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){s.label=o[1];break}if(6===o[0]&&s.label<a[1]){s.label=a[1],a=o;break}if(a&&s.label<a[2]){s.label=a[2],s.ops.push(o);break}a[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(e){o=[6,e],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,i])}}},o=function(e,t){for(var n=0,r=t.length,a=e.length;n<r;n++,a++)e[a]=t[n];return e},s=function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i="spacerangers-engine-2023-08-14T11:39:14.446Z",c=o(o(["/","data/index.json"],function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,a,o=n.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)s.push(r.value)}catch(e){a={error:e}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(a)throw a.error}}return s}(serviceWorkerOption.assets)),["/?version="+new Date("2023-08-14T11:39:14.446Z").getTime()]);function u(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t]}u("Service version 2023-08-14T11:39:14.446Z worker engine urls: ",c),self.addEventListener("install",(function(e){u("Serviceworker got install event."),e.waitUntil(r(void 0,void 0,void 0,(function(){var e,t,n;return a(this,(function(r){switch(r.label){case 0:return u("Downloading index.json"),[4,fetch("data/index.json").then((function(e){return e.json()}))];case 1:return e=r.sent(),[4,caches.open(i)];case 2:return t=r.sent(),u("Serviceworker opened engine cache='"+i+"', downloading engine"),[4,t.addAll(c)];case 3:return r.sent(),[4,caches.open("spacerangers-quests")];case 4:return n=r.sent(),u("Serviceworker opened quests cache='spacerangers-quests', downloading quests size="+e.dir.quests.totalSize),[4,n.addAll(e.dir.quests.files.map((function(e){return"data/"+e.filePath+e.fileName})))];case 5:return r.sent(),u("Catching done"),[2]}}))})).catch((function(e){throw console.error("Error in sw",e),e})))})),self.addEventListener("activate",(function(e){u("ServiceWorker activation started"),e.waitUntil(r(void 0,void 0,void 0,(function(){var e,t,n,r,o,c;return a(this,(function(a){switch(a.label){case 0:return[4,caches.has("spacerangers-music")];case 1:return a.sent()?(u("dropping old ogg music cache spacerangers-music"),[4,caches.delete("spacerangers-music")]):[3,3];case 2:a.sent(),a.label=3;case 3:return a.trys.push([3,9,10,11]),[4,caches.keys()];case 4:e=s.apply(void 0,[a.sent().filter((function(e){return 0===e.indexOf("spacerangers-engine")})).filter((function(e){return e!==i}))]),t=e.next(),a.label=5;case 5:return t.done?[3,8]:(u("Removing old engine cache "+(n=t.value)),[4,caches.delete(n)]);case 6:a.sent(),a.label=7;case 7:return t=e.next(),[3,5];case 8:return[3,11];case 9:return r=a.sent(),o={error:r},[3,11];case 10:try{t&&!t.done&&(c=e.return)&&c.call(e)}finally{if(o)throw o.error}return[7];case 11:return u("Service worker claiming clients"),[4,self.clients.claim()];case 12:return a.sent(),u("Service worker activation finished"),[2]}}))})))})),self.addEventListener("fetch",(function(e){e.respondWith(r(void 0,void 0,void 0,(function(){var t,n,r,o,s,c,l,f;return a(this,(function(a){switch(a.label){case 0:return[4,caches.open(i).then((function(t){return t.match(e.request.url)}))];case 1:return(o=a.sent())?[3,3]:[4,caches.open("spacerangers-quests").then((function(t){return t.match(e.request.url)}))];case 2:o=a.sent(),a.label=3;case 3:return(r=o)?[3,5]:[4,caches.open("spacerangers-images").then((function(t){return t.match(e.request.url)}))];case 4:r=a.sent(),a.label=5;case 5:return(n=r)?[3,7]:[4,caches.open("spacerangers-music-mp3").then((function(t){return t.match(e.request.url)}))];case 6:n=a.sent(),a.label=7;case 7:return t=n,(s=e.request.headers.get("range"))?(u("headersRange='"+s+"'"),(c=s.match(/^bytes\=(\d+)\-$/))?(l=parseInt(c[1]),u("Range request for "+e.request.url+", starting position: "+l),t?[3,8]:(u("No audio cache for "+e.request.url),[2,fetch(e.request)])):[2,fetch(e.request)]):[3,10];case 8:return u("Cache audio hit for "+e.request.url),[4,t.arrayBuffer()];case 9:return f=a.sent(),[2,new Response(f.slice(l),{status:206,statusText:"Partial Content",headers:[["Content-Range","bytes "+l+"-"+(f.byteLength-1)+"/"+f.byteLength]]})];case 10:return t?(u("Cache hit for "+e.request.url),[2,t]):(u("No cache for "+e.request.url),[2,fetch(e.request)])}}))})))})),self.addEventListener("message",(function(e){if(u("Got a message="+e.data),"Dear serviceWorker, please do a skipWaiting call"===e.data)return u("service worker will skipWaiting and start to activate"),self.skipWaiting()}))}]);
//# sourceMappingURL=sw.js.map