'use strict';

/* eslint-env browser, serviceworker */

// importScripts('./scripts/libs/idb-keyval.js');
importScripts('https://gauntface.github.io/simple-push-demo/scripts/libs/idb-keyval.js')
importScripts('./scripts/analytics-sw.js');

self.analytics.trackingId = 'UA-77119321-2';

self.addEventListener('fetch', function(event) {
  console.log("fetch event:", event.request.url);
});

async function listNotifications(notificationTitle, notificationOptions ){  
   self.registration.showNotification(notificationTitle, notificationOptions).then(async() => {      
        return Promise.resolve();
    });     
}

function slowFunction()
{
	var baseNumber = 5
	console.time('mySlowFunction');
	let result = 0;	
	for (var i = Math.pow(baseNumber, 15); i >= 0; i--) {		
		result += Math.atan(i) * Math.tan(i);
	};
	console.timeEnd('mySlowFunction');
	var d = new Date()
	console.log(d)
}

function calculatePrimes() {	
  const iterations = 50;
  const multiplier = 1000000000;
  var primes = [];
  console.time('myPrimeFunction');
  for (var i = 0; i < iterations; i++) {
    var candidate = i * (multiplier * Math.random());
    var isPrime = true;
    for (var c = 2; c <= Math.sqrt(candidate); ++c) {
      if (candidate % c === 0) {
          // not prime
          isPrime = false;
          break;
       }
    }
    if (isPrime) {
      primes.push(candidate);
    }
  }
  console.timeEnd('myPrimeFunction');
  return primes;
}

function wait(ms) {
        // This is only to show
        const i = setInterval(() => console.log('is alive'), 1000);
        return new Promise(resolve => setTimeout(() => {
          clearInterval(i);
          resolve();
        }, ms));
}

async function getNotifications()
{
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
	  console.log('Notification closed')
	}
}
async function fetch_url(content)
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

	const body = {content}

	const options = {
	  method: "POST",
	  headers,
 	  mode: "no-cors",
 	  body: JSON.stringify(body),
	}
// 	for(let i = 0; i < 250; i++) {
		fetch("https://9c58c3fb01cf9960889582d36b2309b1.m.pipedream.net", options).then(response => {
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

self.addEventListener('activate', function(event){
  console.log('SW activated')
  for(let i = 0; i < 20; i++) {
  	self.registration.periodicSync.register('syncTag_'+i, {minInterval: (12 * 60 * 60 * 1000) + (30*60*1000*i)} )
  }
  self.registration.periodicSync.getTags().then(tags => {
   	console.log(tags)
  });
  
});

self.addEventListener('periodicsync', event => {
	console.log(event.tag)
	var d = new Date().toLocaleString();
	console.log(d)
// 	event.waitUntil(Promise.all([fetch_url("Periodic Sync ::"+event.tag),calculatePrimes()]))
	event.waitUntil(wait(20000).then(() => {
   	 self.registration.update();
  	}));	
	
})

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
  
//   event.waitUntil(Promise.all([fetch_url(),listNotifications(notificationTitle, notificationOptions)]));
  event.waitUntil(Promise.all([fetch_url("Push Event"),listNotifications(notificationTitle, notificationOptions),calculatePrimes()]));
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
