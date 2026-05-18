/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDYEMwPt94AVf8ErEenPOCXJzr9mBVFYNw",
  authDomain: "cooknet-d6797.firebaseapp.com",
  projectId: "cooknet-d6797",
  storageBucket: "cooknet-d6797.firebasestorage.app",
  messagingSenderId: "616407586003",
  appId: "1:616407586003:web:6b32be8d8ca66c8ab0f026",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "FlavorFlow";
  const options = {
    body: payload.notification?.body || "You have a new update.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    data: payload.data,
    vibrate: [200, 100, 200],
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/home");
    }),
  );
});
