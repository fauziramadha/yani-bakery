# Bakery Multi Starter (shop/ + admin/)

This repo contains two Vite React apps:
- `shop/` - customer-facing site
- `admin/` - admin dashboard (requires Firebase Auth)

Important security note: The file `src/firebaseConfig.js` in each app contains default Firebase configuration values for convenience (provided by the user). Do not publish real API keys or credentials to public GitHub. Prefer setting environment variables in Vercel instead.

Provided Firebase config defaults (embedded for convenience)
