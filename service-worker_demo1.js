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

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
});

// self.addEventListener('push', async function (event) {
//   console.log('Received push');
//   var notificationTitle = 'Hello';
//   var notificationOptions = {
//     body: 'Thanks for sending this push msg.',
//     icon: './images/logo-192x192.png',
//     badge: './images/badge-72x72.png',
//     tag: 'simple-push-demo-notification',
//     data: {
//       url: 'https://developers.google.com/web/fundamentals/getting-started/push-notifications/'
//     }
//   };

//   if (event.data) {
//     var dataText = event.data.text();
//     notificationTitle = 'Received Payload';
//     notificationOptions.body = 'Push data: \'' + dataText + '\'';
//   }
  
 
//   event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));
// });

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
