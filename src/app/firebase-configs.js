import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyAghbovdaW07pXPy3DH32-qrYxlm0ZSXrY",
  authDomain: "moneycog-70638.firebaseapp.com",
  projectId: "moneycog-70638",
  storageBucket: "moneycog-70638.appspot.com",
  messagingSenderId: "104366726847",
  appId: "1:104366726847:web:f6cc18df837d52e71c700a",
  measurementId: "G-NE8E0YTGTF"
});

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'production') {
  firebase.analytics(firebaseApp);
} else {
  // firebase.firestore.setLogLevel("debug");
}

export const firedb = firebaseApp.firestore();

export default firebaseApp;
