/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker
// Uses compat SDK because this file is served as-is from /public

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// Your web app's Firebase configuration (public)
firebase.initializeApp({
  apiKey: "AIzaSyBCwdMGYI9ungJFoxX0Wwx0nt0CMXCWhjo",
  authDomain: "koperasi-3c1fc.firebaseapp.com",
  projectId: "koperasi-3c1fc",
  storageBucket: "koperasi-3c1fc.firebasestorage.app",
  messagingSenderId: "758084313432",
  appId: "1:758084313432:web:1ce250ccc63a4392dcc52d",
  measurementId: "G-9VL33MWL5C",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || "Notification";
  const options = {
    body: notification.body,
    // icon: "/icon-192x192.png", // Optional: provide a PNG icon if available
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl =
    (event.notification && event.notification.data &&
      (event.notification.data.click_action || event.notification.data.url)) || 
    "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
        return undefined;
      })
  );
});

