/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["docs/app.css","ab39d46bd917c51581f136a335d9d183"],["docs/app.css.gz","755de0d2fc9af0c0fa2c6e9955d98340"],["docs/app.css.map","0c0a7f0610ba95ce872fa6737a4cfbbe"],["docs/app.js","76d8122937fa0f4056a2d9b5ae61903e"],["docs/app.js.gz","903c2f432fdd4908c6c1eea13127be66"],["docs/app.js.map","8cc9b1caf81202f266669039fe9962d9"],["docs/files/Bonham_Acres_Sec_1_Amendent_3.pdf","48c7c81921dc4eb3723ea33fe56c7394"],["docs/files/Bonham_Acres_Sec_4.pdf","e775199911cbf1c57bd0e6b94cce7c1f"],["docs/icons/facebook.png","7ac4f70f8d267cc44ad9cd3b174eec44"],["docs/icons/gmail.png","34b691a4f2743afcef57db6006469761"],["docs/icons/icon-192x192.png","5b677f2775bfea90ba43b9a5fb765a6e"],["docs/icons/icon-256x256.png","e18d9d8b48138cc3d9115f518af945f5"],["docs/icons/icon-384x384.png","9d3c5d9b21dcf43de7c7d649f7935664"],["docs/icons/icon-512x512.png","d9fd34b3338468a9a9233aba8ebdab0f"],["docs/icons/nextdoor.png","9e2b1fbc6a59ce10f509a5f3e0b516f4"],["docs/images/BNP.jpeg","2c80785f543c8498af6aaf32cca58093"],["docs/images/BNP.webp","ca3e1ee76f3bb57d2d8179233a8462a1"],["docs/images/BNP1.jpeg","f30df42107180c811eed7d32a2f05509"],["docs/images/BNP1.webp","d5d2562ee855b496c2182aeee399ed09"],["docs/images/IMG_3216.jpeg","24e6d1bf3b14f020ad33eea28cff5934"],["docs/images/IMG_3216.webp","72fa4dd65b805f9a4c0af8c6cf42dc98"],["docs/images/IMG_3989.webp","7372f3227941048792d12f58186f18fc"],["docs/images/IMG_3990.webp","42a96d4d315760f0599494816cf17712"],["docs/images/IMG_3991.webp","3418e230f1283c78492ecc11962be1ca"],["docs/images/IMG_3992.webp","3f6c47f2b9a736436ddc71d38a3d142c"],["docs/images/IMG_3993.webp","4dd46165a8e2f49c08fc9d022d7989f6"],["docs/images/IMG_3995.webp","7036baae12f69ab42750db368adb748b"],["docs/images/IMG_3996.webp","d04c29ddd51f6e663bf0236457e0970f"],["docs/images/IMG_3997.webp","74455dcc72712c42703f7d0cbb8ac0e4"],["docs/images/IMG_3998.webp","9bca3d16c157f803ac7af598681d8d63"],["docs/images/IMG_3999.webp","9b84c7dd76a53b83191d06d56c1853f5"],["docs/images/IMG_4001.webp","d46e8b93f508ee7de4ad111044a62eb7"],["docs/images/IMG_4002.webp","3f53d441d38bcb3c53a5d4cba512d7ed"],["docs/images/IMG_4003.webp","64076ac0ab1703c6c8751c24f2435772"],["docs/images/IMG_4004.webp","25f03fb488a42feadc223980709ebfb6"],["docs/images/IMG_4005.webp","78683f3f8348055f86bd4e81d67d3193"],["docs/images/IMG_4006.webp","ac72ee98d0d206363b93c182af833d0a"],["docs/images/IMG_4007.webp","bcbbbd1f6365f7a8be26b250b2b80343"],["docs/images/IMG_4008.webp","b27b3353fe01a48e44ee1724348f72df"],["docs/images/IMG_4009.webp","d47fa856d17aec5aead987e8496276de"],["docs/images/IMG_4010.webp","a946fdd9d40360a60ab1c2771033db75"],["docs/images/IMG_4011.webp","2ffea0cca03e6a7b9962915282e91c5a"],["docs/images/IMG_4012.webp","d29eb3f4fe29bbeb27f15a9a6357a295"],["docs/images/IMG_4013.webp","d9d92b14b10557f7cd1b29348681ba03"],["docs/images/IMG_4014.webp","2b026731485d9f1d06dd581ccc81ad42"],["docs/images/IMG_4015.webp","94a1c9c1a3b41428605b30eeea45afa8"],["docs/images/IMG_4016.webp","91e26306973aaba4b6df98915f9c5d40"],["docs/images/IMG_4017.webp","d9fae13b60d9c6c6ddf4b8182b931105"],["docs/images/IMG_4018.webp","c7813ed9a4188b9a8b8f1fa24bf1d70b"],["docs/images/IMG_4019.webp","5801e01ef3243f337da4a3a971f5e938"],["docs/images/IMG_4020.webp","36be4739d9999d2e61fc22f356997c79"],["docs/images/IMG_4021.webp","3ce21fa732ccbe26c3313f741437764b"],["docs/images/IMG_4022.webp","2d571046ffcc03e0cbd9a50d07743968"],["docs/images/IMG_4023.webp","26a58bac4215cb4d0818517f376c0938"],["docs/images/IMG_4024.webp","6bf1663c726004cb593de4deba48b73d"],["docs/images/IMG_4025.webp","ed0fe24c055cb824b3b911c520ffde82"],["docs/images/IMG_4026.webp","8ef2b97ac54b71a0bc6f7d65e711a69f"],["docs/images/IMG_4027.webp","23ad47bbcd8178a6cede8ff55e5503b4"],["docs/images/IMG_4028.webp","5e8d1abc30949c37fcd849fb9e0c6587"],["docs/images/IMG_4029.webp","ea6140462a8a647075b8ff5d6d71fb8f"],["docs/images/baca-map.webp","2bf8b5fdc63b6c54244fe382ab393471"],["docs/images/logo.jpeg","ec5f7b7fd3fdeb068228f9537ed05310"],["docs/images/logo.webp","0dc2223d19cfa06815c645e409de4b20"],["docs/images/main.jpg","c1682e981da965d758666e27b27650d3"],["docs/images/main.webp","8c7b24466716c5622c98a92c718bda1b"],["docs/images/test.JPG","7182208fedf74b002c29c7f77f30b96d"],["docs/index.html","4147b964d9bf8f4130b5670ab00c996a"],["docs/index.html.gz","8c6a28946c6570d6e459be4a94eb7fb7"],["docs/manifest.json","130d0a87fabbbe98ddc3c037dcfe8204"],["docs/vendor.js.gz","8ff7b2ff868ef5df887b8569770270d5"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
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







