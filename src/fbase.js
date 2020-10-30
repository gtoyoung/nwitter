import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nwitter-a8a0f.firebaseio.com",
});

var firebaseConfig = {
  apiKey: "AIzaSyD9eguKL9O5vuq89d-GxWMH98e-mlF4J6M",
  authDomain: "nwitter-a8a0f.firebaseapp.com",
  databaseURL: "https://nwitter-a8a0f.firebaseio.com",
  projectId: "nwitter-a8a0f",
  storageBucket: "nwitter-a8a0f.appspot.com",
  messagingSenderId: "807338571662",
  appId: "1:807338571662:web:232220091bf91673a316df",
};

firebase.initializeApp(firebaseConfig);

export const adminInstance = admin;

export const firebaseInstance = firebase;

export const authService = firebase.auth();

export const dbService = firebase.firestore();

export const storageService = firebase.storage();
