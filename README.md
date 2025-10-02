# Bakery Multi Starter (shop/ + admin/)

This repo contains two Vite React apps:
- `shop/` - customer-facing site
- `admin/` - admin dashboard (requires Firebase Auth)

Important security note: The file `src/firebaseConfig.js` in each app contains default Firebase configuration values for convenience (provided by the user). Do not publish real API keys or credentials to public GitHub. Prefer setting environment variables in Vercel instead.

Provided Firebase config defaults (embedded for convenience):
apiKey: "AIzaSyBvmJhGaAqtp0z95utXQ7YBCpI20F_XjCE"
authDomain: "hpp-yani.firebaseapp.com"
projectId: "hpp-yani"
storageBucket: "hpp-yani.firebasestorage.app"
messagingSenderId: "166817013117"
appId: "1:166817013117:web:1e8af138fbd2a176278014"
measurementId: "G-2PQ20TVFK1"

Admin account to create in Firebase Auth (create this user via Firebase Console):
email: douceurdeyanis@gmail.com
password: bodoamat
