import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: ENV['API_KEY'],
  authDomain: ENV['AUTH_DOMAIN'],
  projectId: ENV['PROJECT_ID'],
  storageBucket: ENV['STORAGE_BUCKET'],
  messagingSenderId: ENV['MESSAGE_SENDER_ID'],
  appId: ENV['APP_ID'],
}

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
