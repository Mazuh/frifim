import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = Object.freeze({
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
});

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'production') {
  firebase.analytics(firebaseApp);
} else {
  // firebase.firestore.setLogLevel("debug");
}

export const firedb = firebaseApp.firestore();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithEmailAndPassword = (...args) => firebaseApp.auth().signInWithEmailAndPassword(...args)

export const onIdTokenChanged = (...args) => firebaseApp.auth().onIdTokenChanged(...args);

export default firebaseApp;
