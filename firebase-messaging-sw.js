// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBy8ZAMagjX627gcfe0NuRaC1WfC736en0",
  authDomain: "bufferzone-63501.firebaseapp.com",
  databaseURL: "https://bufferzone-63501-default-rtdb.firebaseio.com",
  projectId: "bufferzone-63501",
  storageBucket: "bufferzone-63501.firebasestorage.app",
  messagingSenderId: "137881085889",
  appId: "1:137881085889:web:d5ff1ff3bee6d3e0373140",
  measurementId: "G-VRQHT301C4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
  const notificationBody = payload.notification?.body || payload.data?.body || '';

  const notificationOptions = {
    body: notificationBody,
    icon: payload.data?.icon || '/logo.png', // Replace with your logo URL
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: {
      clickUrl: payload.data?.clickUrl || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickUrl = event.notification.data?.clickUrl || '/';
  event.waitUntil(
    clients.openWindow(clickUrl)
  );
});
