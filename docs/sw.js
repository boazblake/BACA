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
    "revision": "e6a0344d5ce102d43ce4d0cf38fff5e9"
  },
  {
    "url": "app.css.gz",
    "revision": "57d80928521d5e26bab5a8cf957641c2"
  },
  {
    "url": "app.css.map",
    "revision": "056851195414c78640068cf1463934de"
  },
  {
    "url": "app.js",
    "revision": "253fd2d2ae872ae771ddbc90b8e5f5a3"
  },
  {
    "url": "app.js.gz",
    "revision": "d80536b0a1148907f28aa194cfda5a98"
  },
  {
    "url": "app.js.map",
    "revision": "9996ab71954beb2ad78c850adcc3cd8f"
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
    "url": "images/IMG_3994.webp",
    "revision": "7fbf8caa2ac37fb9b74b02d006c64da9"
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
    "revision": "ad183e76e9f6b00040aa764470e812ac"
  },
  {
    "url": "index.html.gz",
    "revision": "54de369edc3ed0c823e4883072e75001"
  },
  {
    "url": "manifest.json",
    "revision": "1764325a3207a28490a880008475f88a"
  },
  {
    "url": "vendor.js.gz",
    "revision": "05a50db047fefd50161cc5def1de45da"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
nalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







