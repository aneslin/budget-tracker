const FILES_TO_CACHE = [
  "./js/index.js",
  "./index.html",
  "./css/styles.css",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
]


const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// Respond with cached resources. credit to https://stackoverflow.com/users/5349542/blackbeard for code to fix
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) {
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {                
          return fetch(e.request).then(function(res){
              return caches.open(CACHE_NAME)
              .then(function(cache){
                  cache.put(e.request.url, res.clone())
                  return res
              })
          }) 
        }
  
      })
    )
  })
  
  // Cache resources
  self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
      
        return cache.addAll(FILES_TO_CACHE)
      })
    )
  })
  
  // Delete outdated caches
  self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
      
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
   
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
            
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });