if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('./sw.js', { scope: '/' })
			.then(function(registration) {
				console.log("Service Worker Registered");
        console.log('registration: ', registration )
        // return registration.pushManager.getSubscription()
        //   .then(function(subscription) {
        //     if (subscription) {
        //       return subscription;
        //     }

        //     return registration.pushManager.subscribe({ userVisibleOnly: true });
        //   });
      })
      .catch(function(err) {
        console.log("Service Worker Failed to Register", err);
      })

      console.log( 'El controlador es: ', navigator.serviceWorker.controller);

      navigator.serviceWorker.oncontrollerchange = function() {
        this.controller.onstatechange = function() {
          console.log('Controller has changed: ', this);

          navigator.serviceWorker.controller.postMessage('totto');
        };
      }

      navigator.serviceWorker.ready.then(function(swRegistration) {
        // return swRegistration.sync.register('myFirstSync');
      });
    }
