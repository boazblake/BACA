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
    "revision": "43c4d96ff294699525940a16fe1d7a54"
  },
  {
    "url": "app.css.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app.js",
    "revision": "0119ba3ff119af9e517a5d4c785ff8f1"
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
    "revision": "b9d33faee3ee270fedc722749813da51"
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
