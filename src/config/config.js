import firebase from 'firebase';
import {firebaseConfig} from './firebaseconfig'

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//console.log(firebaseConfig);
export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

