/* 
 *  Copyright © 2021 EugenesWorks:zDGVDzRz.
 *  author : EugenesWorks(https://eugenesworks.com)
 *  This is MITLicense.
 */

var CACHE_VERSION = 'tm2cash-v8';
var DISP_VERSION = 'tm2cash-d-v8';

var resources = [
  'offline.html',
  'img/splash.png'
];


self.addEventListener('install', function (event) {
  console.log('ServiceWorker Install');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) {
        cache.addAll(resources);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(DISP_VERSION)
                .then(function (cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function () {
                
            });
        }
      })
  );
});

self.addEventListener('activate', function (event) {
  console.log('activate ServiceWorker');
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_VERSION && key !== DISP_VERSION) {
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});
