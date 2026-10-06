/* Service worker: שומר את האפליקציה במטמון כדי שתעבוד גם בלי רשת.
   האסטרטגיה היא "הגש מהמטמון ורענן ברקע" — הדף נפתח מיד, והגרסה
   החדשה נכנסת לתוקף בטעינה הבאה. */
var CACHE = 'quiz-shell-v2';
var SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/data-vocab.js',
  'js/data-spelling.js',
  'js/sections.js',
  'js/scheduler.js',
  'js/curriculum.js',
  'js/questions.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') { return; }

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) { return; }

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var fresh = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()); }
          return res;
        }).catch(function () {
          /* אופליין: אם אין תשובה במטמון, ניווט מקבל את דף הבית */
          return hit || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
        });
        return hit || fresh;
      });
    })
  );
});
