import firebase from 'firebase';

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
firebase.analytics(firebaseApp);

export default firebaseApp;
