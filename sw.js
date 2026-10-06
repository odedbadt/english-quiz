/* Service worker: שומר את האפליקציה במטמון כדי שתעבוד גם בלי רשת.
   האסטרטגיה היא "הגש מהמטמון ורענן ברקע" — הדף נפתח מיד, והגרסה
   החדשה נכנסת לתוקף בטעינה הבאה. */
var CACHE = 'quiz-shell-v3';
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

/* הדף מבקש עדכון מיידי: מוחקים את המטמון ומושכים מחדש מהרשת.
   בלי זה הדרך היחידה לעדכן אפליקציה מותקנת היא רענון כפול, שאינו
   זמין כשהיא פתוחה כאפליקציה ולא בדפדפן. */
self.addEventListener('message', function (e) {
  if (!e.data || e.data.type !== 'refresh') { return; }
  var reply = e.ports && e.ports[0];
  caches.keys()
    .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
    .then(function () { return caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }); })
    .then(function () { if (reply) { reply.postMessage({ ok: true }); } })
    .catch(function (err) { if (reply) { reply.postMessage({ ok: false, error: String(err) }); } });
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
