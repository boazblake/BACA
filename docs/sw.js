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
    "revision": "fc429b2f1b6cf9e98050758515aaf514"
  },
  {
    "url": "app.css.gz",
    "revision": "f4c24493022f02be026da611e5245ea9"
  },
  {
    "url": "app.css.map",
    "revision": "8f056dc7af2e66cc81e9ed834c0063c9"
  },
  {
    "url": "app.js",
    "revision": "51431f748401756615f0c5355b3b3fb7"
  },
  {
    "url": "app.js.gz",
    "revision": "14ea879217b900c41bea49542c904423"
  },
  {
    "url": "app.js.map",
    "revision": "e841afe51b6206530d7a7df16467d586"
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
    "url": "icons/nextdoor.png",
    "revision": "9e2b1fbc6a59ce10f509a5f3e0b516f4"
  },
  {
    "url": "images/baca-logo.png",
    "revision": "c576c6ff40c0cbd6053cefc56da1e8c5"
  },
  {
    "url": "images/baca-logo.webp",
    "revision": "cc6aacf456f68f51110a3558a994846a"
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
    "revision": "94db90297296cb11e1ef2ae27ef06cc4"
  },
  {
    "url": "index.html.gz",
    "revision": "eecf4a5ee8c0c6d5e1025a3b217f7816"
  },
  {
    "url": "manifest.json",
    "revision": "66fba0463b7f8a94b44aef864ba46875"
  },
  {
    "url": "vendor.js.gz",
    "revision": "7a58406494e97ef4b985319a97f99788"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
