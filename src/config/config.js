import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCGEJVHLDae6WjWTdmg79hHzLbwgx9f8eQ",
  authDomain: "instagram-d89e3.firebaseapp.com",
  databaseURL: "https://instagram-d89e3.firebaseio.com",
  projectId: "instagram-d89e3",
  storageBucket: "instagram-d89e3.appspot.com",
  messagingSenderId: "390298799165",
  appId: "1:390298799165:web:e2926a3fcbe73476d16e54"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

