import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyAQKwCa3DHb46L4VSvARHXnwpydp680dmU",
  authDomain: "todo-c2a00.firebaseapp.com",
  projectId: "todo-c2a00",
  storageBucket: "todo-c2a00.appspot.com",
  messagingSenderId: "977375759718",
  appId: "1:977375759718:web:b8c81e7e50c64f5e2dcca7"
};

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const tasksCollection = db.collection('tasks')

// export utils/refs
export {
  db,
  auth,
  tasksCollection,
}
