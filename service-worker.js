var cache_name = 'v1';
self.addEventListener('install', function(event) {
	console.log('Install');

	var file_to_cache = [
    '/',
    '/bower_components/bootstrap/dist/css/bootstrap.min.css',
    '/bower_components/jquery/dist/jquery.min.js',
    '/bower_components/angular/angular.min.js',
    '/bower_components/angular-ui-router/release/angular-ui-router.min.js',
    '/app/app.module.js',
    '/app/app.config.js',
    '/app/routes/home/home.html'
  ];

  event.waitUntil(
    caches.open(cache_name)
    .then(function(cache) {
      return cache.addAll(file_to_cache);
    })
    .then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {  
	console.log('Activate');
});

self.addEventListener('fetch', function(event) {
	console.log('Fetch event: ', event);
	event.respondWith(
    // new Response('Hello from your friendly neighbourhood service worker!')
    caches
      .match(event.request)
      .then(function(response){
        return response || fetch(event.request).then(function(response){
          caches.open(cache_name).then(function(cache){
            cache.put(event.request, response.clone());
            console.log('response: ', response);
            return response;
          });
        });
      })
  );
});