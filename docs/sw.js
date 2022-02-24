/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app.css",
    "revision": "647578179cfb33c9b70508a22aca4d14"
  },
  {
    "url": "app.css.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app.js",
    "revision": "a2f4142c1ff3ec4d536fd67fd8184ff4"
  },
  {
    "url": "app.js.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "files/Bonham_Acres_Sec_1_Amendent_3.pdf",
    "revision": "48c7c81921dc4eb3723ea33fe56c7394"
  },
  {
    "url": "files/Bonham_Acres_Sec_4.pdf",
    "revision": "e775199911cbf1c57bd0e6b94cce7c1f"
  },
  {
    "url": "fonts/Poppins/OFL.txt",
    "revision": "69045d03afdf61aeb37246af6001af9c"
  },
  {
    "url": "fonts/Poppins/Poppins-Black.ttf",
    "revision": "14d00dab1f6802e787183ecab5cce85e"
  },
  {
    "url": "fonts/Poppins/Poppins-BlackItalic.ttf",
    "revision": "e9c5c588e39d0765d30bcd6594734102"
  },
  {
    "url": "fonts/Poppins/Poppins-Bold.ttf",
    "revision": "08c20a487911694291bd8c5de41315ad"
  },
  {
    "url": "fonts/Poppins/Poppins-BoldItalic.ttf",
    "revision": "19406f767addf00d2ea82cdc9ab104ce"
  },
  {
    "url": "fonts/Poppins/Poppins-ExtraBold.ttf",
    "revision": "d45bdbc2d4a98c1ecb17821a1dbbd3a4"
  },
  {
    "url": "fonts/Poppins/Poppins-ExtraBoldItalic.ttf",
    "revision": "8afe4dc13b83b66fec0ea671419954cc"
  },
  {
    "url": "fonts/Poppins/Poppins-ExtraLight.ttf",
    "revision": "6f8391bbdaeaa540388796c858dfd8ca"
  },
  {
    "url": "fonts/Poppins/Poppins-ExtraLightItalic.ttf",
    "revision": "a9bed017984a258097841902b696a7a6"
  },
  {
    "url": "fonts/Poppins/Poppins-Italic.ttf",
    "revision": "c1034239929f4651cc17d09ed3a28c69"
  },
  {
    "url": "fonts/Poppins/Poppins-Light.ttf",
    "revision": "fcc40ae9a542d001971e53eaed948410"
  },
  {
    "url": "fonts/Poppins/Poppins-LightItalic.ttf",
    "revision": "0613c488cf7911af70db821bdd05dfc4"
  },
  {
    "url": "fonts/Poppins/Poppins-Medium.ttf",
    "revision": "bf59c687bc6d3a70204d3944082c5cc0"
  },
  {
    "url": "fonts/Poppins/Poppins-MediumItalic.ttf",
    "revision": "cf5ba39d9ac24652e25df8c291121506"
  },
  {
    "url": "fonts/Poppins/Poppins-Regular.ttf",
    "revision": "093ee89be9ede30383f39a899c485a82"
  },
  {
    "url": "fonts/Poppins/Poppins-SemiBold.ttf",
    "revision": "6f1520d107205975713ba09df778f93f"
  },
  {
    "url": "fonts/Poppins/Poppins-SemiBoldItalic.ttf",
    "revision": "9841f3d906521f7479a5ba70612aa8c8"
  },
  {
    "url": "fonts/Poppins/Poppins-Thin.ttf",
    "revision": "9ec263601ee3fcd71763941207c9ad0d"
  },
  {
    "url": "fonts/Poppins/Poppins-ThinItalic.ttf",
    "revision": "01555d25092b213d2ea3a982123722c9"
  },
  {
    "url": "icons/facebook.png",
    "revision": "7ac4f70f8d267cc44ad9cd3b174eec44"
  },
  {
    "url": "icons/gmail.png",
    "revision": "34b691a4f2743afcef57db6006469761"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "5b677f2775bfea90ba43b9a5fb765a6e"
  },
  {
    "url": "icons/icon-256x256.png",
    "revision": "e18d9d8b48138cc3d9115f518af945f5"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "9d3c5d9b21dcf43de7c7d649f7935664"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "d9fd34b3338468a9a9233aba8ebdab0f"
  },
  {
    "url": "icons/maskable_icon_x128.png",
    "revision": "d7f05d94c45c66c8fd921e622bba712c"
  },
  {
    "url": "icons/maskable_icon_x192.png",
    "revision": "53066c54597624175d267ad9d5ea6a43"
  },
  {
    "url": "icons/maskable_icon_x384.png",
    "revision": "c87a96f48271f606dd659edc39fd04c7"
  },
  {
    "url": "icons/maskable_icon_x48.png",
    "revision": "b288ecec08e59cbe48fb6a8cc4b18f9e"
  },
  {
    "url": "icons/maskable_icon_x72.png",
    "revision": "3b7d65254ebac8468332bb8fcf573251"
  },
  {
    "url": "icons/maskable_icon_x96.png",
    "revision": "5015b0911f69ba3540c0ad8bcf689014"
  },
  {
    "url": "icons/maskable_icon.png",
    "revision": "48e28e5a9d7f9554830d7649039d0583"
  },
  {
    "url": "icons/nextdoor.png",
    "revision": "9e2b1fbc6a59ce10f509a5f3e0b516f4"
  },
  {
    "url": "images/baca-map.webp",
    "revision": "2bf8b5fdc63b6c54244fe382ab393471"
  },
  {
    "url": "images/BNP.jpeg",
    "revision": "2c80785f543c8498af6aaf32cca58093"
  },
  {
    "url": "images/BNP1.jpeg",
    "revision": "f30df42107180c811eed7d32a2f05509"
  },
  {
    "url": "images/IMG_3216.jpeg",
    "revision": "24e6d1bf3b14f020ad33eea28cff5934"
  },
  {
    "url": "images/logo.jpeg",
    "revision": "ec5f7b7fd3fdeb068228f9537ed05310"
  },
  {
    "url": "images/main.jpg",
    "revision": "c1682e981da965d758666e27b27650d3"
  },
  {
    "url": "images/test.JPG",
    "revision": "7182208fedf74b002c29c7f77f30b96d"
  },
  {
    "url": "index.html",
    "revision": "8e144113afcae3ea87d7f3bdcd96cf05"
  },
  {
    "url": "index.html.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "manifest.json",
    "revision": "730ae9426fc53c274069095bd932d631"
  },
  {
    "url": "vendor.js.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
