'use strict';

/* eslint-env browser, serviceworker */

// importScripts('./scripts/libs/idb-keyval.js');
importScripts('https://gauntface.github.io/simple-push-demo/scripts/libs/idb-keyval.js')
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

async function fetch_url()
{
// 	//https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/256/umbrella-icon.png
// 	//https://api.plos.org/search?q=title:DNA
// 	https://9c58c3fb01cf9960889582d36b2309b1.m.pipedream.net
// 	  const response = await fetch('https://cors-anywhere.herokuapp.com/http://api.plos.org/search?q=title:DNA', {
//           method: 'get',
// 		  //mode: 'no-cors',
// 		  /*headers: {
// 			  'Content-Type': 'application/json'
// 			  // 'Content-Type': 'application/x-www-form-urlencoded',
// 			}*/
//         })
// 	  console.log('Request Made from Service Worker on Push!!!!')
// 	  const string = await response.text();
//     const json = string === "" ? "empty" : JSON.parse(string);
//     console.log(json);
//    var entries = self.performance.getEntries();
//    console.log(entries);
	var d = new Date()
	const headers = new Headers()
	headers.append("Content-Type", "application/x-www-form-urlencoded")

	const body = {"message":"May the force be with you."}

	const options = {
	  method:  "GET", //"POST",
	  headers,
// 	  mode: "no-cors",
// 	  body: JSON.stringify(body),
	}
// 	for(let i = 0; i < 250; i++) {
		fetch("https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/256/umbrella-icon.png", options).then(response => {
// 		  console.log(d.getTime()+ ' :: Response :: ' +i+' :: '+response.status)
			console.log(response)
		
		}).catch(err => {
		  console.error(err.message)
		})
// 	}
}


self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
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
  
  event.waitUntil(Promise.all([fetch_url(),listNotifications(notificationTitle, notificationOptions)]));
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
// //   event.waitUntil(Promise.all([self.analytics.trackEvent('notification-close')]));
// 	console.log('Notification closed!!')
//     event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
//     // If a Window tab matching the targeted URL already exists, focus that;
//     const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === 'https://karthikas03.github.io/demo2.html' ? (windowClient.focus(), true) : false);
//     // Otherwise, open a new tab to the applicable URL and focus it.
//     if (!hadWindowToFocus) clients.openWindow('https://karthikas03.github.io/demo2.html').then(windowClient => windowClient ? windowClient.focus() : null);
//   }));
//   clients.openWindow('https://karthikas03.github.io/demo3.html').then(windowClient => windowClient ? windowClient.focus() : console.log('Page opened!!'))
// });
