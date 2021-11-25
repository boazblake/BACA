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
    "revision": "a4c30ec3d031842beb79259b7908e788"
  },
  {
    "url": "app.css.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app.js",
    "revision": "61d967811035c166da17a76fd80c3870"
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
    "revision": "a4b47c61da588adf52d224de0ae77e10"
  },
  {
    "url": "index.html.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "manifest.json",
    "revision": "130d0a87fabbbe98ddc3c037dcfe8204"
  },
  {
    "url": "vendor.js.gz",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
