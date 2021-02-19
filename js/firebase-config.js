// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBMJ8cuBP3XPDmFv68p9MqhOFFokSzQkS0",
    authDomain: "shopping-list-82e7e.firebaseapp.com",
    projectId: "shopping-list-82e7e",
    storageBucket: "shopping-list-82e7e.appspot.com",
    messagingSenderId: "481447573111",
    appId: "1:481447573111:web:68690d224c5695337ef872",
    measurementId: "G-3FKSP9P936"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
