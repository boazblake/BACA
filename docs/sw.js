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
    "revision": "b6b2f6f83c457593426dfaba946238e1"
  },
  {
    "url": "app.js",
    "revision": "efc35671f9e72bb00bb29bc5487502da"
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
    "url": "Images/BNP.jpeg",
    "revision": "2c80785f543c8498af6aaf32cca58093"
  },
  {
    "url": "Images/BNP2.jpeg",
    "revision": "2c80785f543c8498af6aaf32cca58093"
  },
  {
    "url": "Images/BonhamAcresIcon.jpeg",
    "revision": "ec5f7b7fd3fdeb068228f9537ed05310"
  },
  {
    "url": "index.html",
    "revision": "2917a312bd157d1317f4aa5a8cf6adf8"
  },
  {
    "url": "manifest.json",
    "revision": "00c03bf80fb98e25283f4b870a3d87bb"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
