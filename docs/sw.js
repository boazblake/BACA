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
    "revision": "392c48fc2ff5c3634c35d64761128ed1"
  },
  {
    "url": "app.css.gz",
    "revision": "c61660f70d86b5ab0e0e6d6491e04e5d"
  },
  {
    "url": "app.css.map",
    "revision": "a2a2f60b1c6becdc2b4bf99e4f505662"
  },
  {
    "url": "app.js",
    "revision": "470a66100181aae1a01096cec4e07474"
  },
  {
    "url": "app.js.gz",
    "revision": "f5eef0660bb9d9bf08ee2691eed0b14a"
  },
  {
    "url": "app.js.map",
    "revision": "a320ce59baa9ab411e169442cde62aec"
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
    "url": "images/BNP.webp",
    "revision": "ca3e1ee76f3bb57d2d8179233a8462a1"
  },
  {
    "url": "images/BNP1.jpeg",
    "revision": "f30df42107180c811eed7d32a2f05509"
  },
  {
    "url": "images/BNP1.webp",
    "revision": "d5d2562ee855b496c2182aeee399ed09"
  },
  {
    "url": "images/IMG_3216.jpeg",
    "revision": "24e6d1bf3b14f020ad33eea28cff5934"
  },
  {
    "url": "images/IMG_3216.webp",
    "revision": "72fa4dd65b805f9a4c0af8c6cf42dc98"
  },
  {
    "url": "images/IMG_3989.webp",
    "revision": "7372f3227941048792d12f58186f18fc"
  },
  {
    "url": "images/IMG_3990.webp",
    "revision": "42a96d4d315760f0599494816cf17712"
  },
  {
    "url": "images/IMG_3991.webp",
    "revision": "3418e230f1283c78492ecc11962be1ca"
  },
  {
    "url": "images/IMG_3992.webp",
    "revision": "3f6c47f2b9a736436ddc71d38a3d142c"
  },
  {
    "url": "images/IMG_3993.webp",
    "revision": "4dd46165a8e2f49c08fc9d022d7989f6"
  },
  {
    "url": "images/IMG_3995.webp",
    "revision": "7036baae12f69ab42750db368adb748b"
  },
  {
    "url": "images/IMG_3996.webp",
    "revision": "d04c29ddd51f6e663bf0236457e0970f"
  },
  {
    "url": "images/IMG_3997.webp",
    "revision": "74455dcc72712c42703f7d0cbb8ac0e4"
  },
  {
    "url": "images/IMG_3998.webp",
    "revision": "9bca3d16c157f803ac7af598681d8d63"
  },
  {
    "url": "images/IMG_3999.webp",
    "revision": "9b84c7dd76a53b83191d06d56c1853f5"
  },
  {
    "url": "images/IMG_4001.webp",
    "revision": "d46e8b93f508ee7de4ad111044a62eb7"
  },
  {
    "url": "images/IMG_4002.webp",
    "revision": "3f53d441d38bcb3c53a5d4cba512d7ed"
  },
  {
    "url": "images/IMG_4003.webp",
    "revision": "64076ac0ab1703c6c8751c24f2435772"
  },
  {
    "url": "images/IMG_4004.webp",
    "revision": "25f03fb488a42feadc223980709ebfb6"
  },
  {
    "url": "images/IMG_4005.webp",
    "revision": "78683f3f8348055f86bd4e81d67d3193"
  },
  {
    "url": "images/IMG_4006.webp",
    "revision": "ac72ee98d0d206363b93c182af833d0a"
  },
  {
    "url": "images/IMG_4007.webp",
    "revision": "bcbbbd1f6365f7a8be26b250b2b80343"
  },
  {
    "url": "images/IMG_4008.webp",
    "revision": "b27b3353fe01a48e44ee1724348f72df"
  },
  {
    "url": "images/IMG_4009.webp",
    "revision": "d47fa856d17aec5aead987e8496276de"
  },
  {
    "url": "images/IMG_4010.webp",
    "revision": "a946fdd9d40360a60ab1c2771033db75"
  },
  {
    "url": "images/IMG_4011.webp",
    "revision": "2ffea0cca03e6a7b9962915282e91c5a"
  },
  {
    "url": "images/IMG_4012.webp",
    "revision": "d29eb3f4fe29bbeb27f15a9a6357a295"
  },
  {
    "url": "images/IMG_4013.webp",
    "revision": "d9d92b14b10557f7cd1b29348681ba03"
  },
  {
    "url": "images/IMG_4014.webp",
    "revision": "2b026731485d9f1d06dd581ccc81ad42"
  },
  {
    "url": "images/IMG_4015.webp",
    "revision": "94a1c9c1a3b41428605b30eeea45afa8"
  },
  {
    "url": "images/IMG_4016.webp",
    "revision": "91e26306973aaba4b6df98915f9c5d40"
  },
  {
    "url": "images/IMG_4017.webp",
    "revision": "d9fae13b60d9c6c6ddf4b8182b931105"
  },
  {
    "url": "images/IMG_4018.webp",
    "revision": "c7813ed9a4188b9a8b8f1fa24bf1d70b"
  },
  {
    "url": "images/IMG_4019.webp",
    "revision": "5801e01ef3243f337da4a3a971f5e938"
  },
  {
    "url": "images/IMG_4020.webp",
    "revision": "36be4739d9999d2e61fc22f356997c79"
  },
  {
    "url": "images/IMG_4021.webp",
    "revision": "3ce21fa732ccbe26c3313f741437764b"
  },
  {
    "url": "images/IMG_4022.webp",
    "revision": "2d571046ffcc03e0cbd9a50d07743968"
  },
  {
    "url": "images/IMG_4023.webp",
    "revision": "26a58bac4215cb4d0818517f376c0938"
  },
  {
    "url": "images/IMG_4024.webp",
    "revision": "6bf1663c726004cb593de4deba48b73d"
  },
  {
    "url": "images/IMG_4025.webp",
    "revision": "ed0fe24c055cb824b3b911c520ffde82"
  },
  {
    "url": "images/IMG_4026.webp",
    "revision": "8ef2b97ac54b71a0bc6f7d65e711a69f"
  },
  {
    "url": "images/IMG_4027.webp",
    "revision": "23ad47bbcd8178a6cede8ff55e5503b4"
  },
  {
    "url": "images/IMG_4028.webp",
    "revision": "5e8d1abc30949c37fcd849fb9e0c6587"
  },
  {
    "url": "images/IMG_4029.webp",
    "revision": "ea6140462a8a647075b8ff5d6d71fb8f"
  },
  {
    "url": "images/logo.jpeg",
    "revision": "ec5f7b7fd3fdeb068228f9537ed05310"
  },
  {
    "url": "images/logo.webp",
    "revision": "0dc2223d19cfa06815c645e409de4b20"
  },
  {
    "url": "images/main.jpg",
    "revision": "c1682e981da965d758666e27b27650d3"
  },
  {
    "url": "images/main.webp",
    "revision": "8c7b24466716c5622c98a92c718bda1b"
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
    "revision": "7cb6601c6f4ab957433152535399c327"
  },
  {
    "url": "manifest.json",
    "revision": "730ae9426fc53c274069095bd932d631"
  },
  {
    "url": "vendor.js.gz",
    "revision": "7e3d7d1d0bbce9b9e040e8529619582b"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
