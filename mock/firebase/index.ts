import firebase from 'firebase'
import { mockFirebase } from 'firestore-jest-mock'
import { mockCollection } from 'firestore-jest-mock/mocks/firestore'

firebase.initializeApp({
  databaseURL: 'https://pdc-koi-default-rtdb.firebaseio.com',
  apiKey: 'AIzaSyDgRQALhAtgKlm5ws8STlz5AIXF2o69RNw',
  authDomain: 'pdc-koi.firebaseapp.com',
  projectId: 'pdc-koi',
  storageBucket: 'pdc-koi.appspot.com',
  messagingSenderId: '279097448554',
  appId: '1:279097448554:web:4028f01e162c7d14c61213',
  measurementId: 'G-J4NV77434B'
})

console.log('initialize App')

mockFirebase()
export const firestore = mockCollection()
