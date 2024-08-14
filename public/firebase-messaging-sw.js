importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
    apiKey: "AIzaSyBjM1CKbSANc4lH7DlDMTchhxroPBrwcfU",
    authDomain: "flipi-app-c2ad1.firebaseapp.com",
    projectId: "flipi-app-c2ad1",
    storageBucket: "flipi-app-c2ad1.appspot.com",
    messagingSenderId: "442289711937",
    appId: "1:442289711937:web:3ded7802c0c6f546890fc0",
    measurementId: "G-5YL9MDWH4R"
};


firebase?.initializeApp(firebaseConfig)


// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
    const payload = event.data.json();
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});