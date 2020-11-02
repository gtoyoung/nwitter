importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js"
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
  "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyD9eguKL9O5vuq89d-GxWMH98e-mlF4J6M",
  authDomain: "nwitter-a8a0f.firebaseapp.com",
  databaseURL: "https://nwitter-a8a0f.firebaseio.com",
  projectId: "nwitter-a8a0f",
  storageBucket: "nwitter-a8a0f.appspot.com",
  messagingSenderId: "807338571662",
  appId: "1:807338571662:web:232220091bf91673a316df",
  measurementId: "G-GZ8HVP61YG",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/itwonders-web-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
