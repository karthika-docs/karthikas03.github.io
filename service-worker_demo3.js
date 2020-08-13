'use strict';

/* eslint-env browser, serviceworker */

importScripts('./scripts/libs/idb-keyval.js');
importScripts('./scripts/analytics-sw.js');

self.analytics.trackingId = 'UA-77119321-2';

async function listNotifications(notificationTitle, notificationOptions ){
  
   self.registration.showNotification(notificationTitle, notificationOptions).then(async() => {
        // Resolve promise AFTER the notification is displayed
        const notifications = await self.registration.getNotifications();
        let currentNotification;
        console.log(notifications)
        for(let i = 0; i < notifications.length; i++) {
          currentNotification = notifications[i];
          console.log(i)
          console.log(currentNotification) 
          // Remember to close the old notification.
          currentNotification.close();
        }
        return Promise.resolve();
    });
     
//   return Promise.resolve()
}

function slowFunction()
{
	var baseNumber = 15
	console.log('computation started')
	console.time('mySlowFunction');
	let result = 0;	
	for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {		
		result += Math.atan(i) * Math.tan(i);
	};
	console.log('computation ended')
	console.timeEnd('mySlowFunction');
}

// in the service worker
addEventListener('message', event => {
  // event is an ExtendableMessageEvent object
  console.log(`The client sent me a message: ${event.data}`);

  event.source.postMessage("Hi client");
  event.waitUntil(Promise.all([slowFunction()]));
});

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
  console.log('Service worker installing')
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
 ;
//   self.registration.update();
});

self.addEventListener('activate', event => {
  console.log('Service worker activated')
  event.waitUntil(clients.claim());
//    self.registration.update();
//           console.log('Registration Updated.'); 
  
//     self.registration.unregister().then(function(boolean) {
//       // if boolean = true, unregister is successful
//           console.log('Registration unregistered.'); 
         
//     });
});

self.addEventListener('push', async function (event) {
  console.log('Received push');
  var notificationTitle = 'Hello';
  var notificationOptions = {
    body: 'Thanks for sending this push msg.',
    icon: './images/logo-192x192.png',
    badge: './images/badge-72x72.png',
    tag: 'simple-push-demo-notification',
    data: {
      url: 'https://developers.google.com/web/fundamentals/getting-started/push-notifications/'
    }
  };

  if (event.data) {
    var dataText = event.data.text();
    notificationTitle = 'Received Payload';
    notificationOptions.body = 'Push data: \'' + dataText + '\'';
  }
  
 
  event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));
});

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();

//   var clickResponsePromise = Promise.resolve();
//   if (event.notification.data && event.notification.data.url) {
//     clickResponsePromise = clients.openWindow(event.notification.data.url);
//   }

//   event.waitUntil(Promise.all([clickResponsePromise, self.analytics.trackEvent('notification-click')]));
// });

// self.addEventListener('notificationclose', function (event) {
//   event.waitUntil(Promise.all([self.analytics.trackEvent('notification-close')]));
// });
