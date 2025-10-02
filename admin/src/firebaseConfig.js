// firebase config defaults (override with env vars in Vercel)
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY || "AIzaSyBvmJhGaAqtp0z95utXQ7YBCpI20F_XjCE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "hpp-yani.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "hpp-yani",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "hpp-yani.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "166817013117",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:166817013117:web:1e8af138fbd2a176278014",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-2PQ20TVFK1",
};