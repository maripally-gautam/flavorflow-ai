# CurryFlow Backend Setup

1. Create a Firebase project named `curryflow` or `flavorflow-ai`.
2. Enable Firebase Authentication provider: Google.
3. Enable Firestore Database in production mode, then publish `firestore.rules`.
4. Enable Firebase Storage, then publish `storage.rules`.
5. Enable Cloud Messaging. Copy the Web Push certificate key into `VITE_FIREBASE_VAPID_KEY`.
6. Create a Firebase Web App and copy its config into `.env.local` using `.env.example`.
7. Get a Gemini key from Google AI Studio and set `VITE_GEMINI_API_KEY` only if you want to demo AI later.
8. No Render/Express backend is required for the evaluation workflow. The app uses Firebase client SDKs.

## Commands

```bash
npm install
npm run dev
npm run build
npx cap sync android
npx cap open android
```

## Firebase Collections

- `users`
- `products`
- `orders`
- `notifications`
- `chats`
- `vendors`
- `deliveryPartners`

## Android / Capacitor

- Keep `.env.local` in the Vite app before building.
- Run `npm run build`, then `npx cap sync android`.
- Android permissions needed for the demo: Internet and notifications. FCM push delivery in Android WebView may need native Firebase setup for production; this MVP stores web FCM tokens for browser/PWA demos.

## Free Tier Notes

- Firestore, Auth, Storage, FCM, and Gemini all work on free/test tiers for hackathon traffic.
- Client-side Gemini is acceptable for a hackathon demo but exposes the key. Move Gemini calls to Cloud Functions before production.
- Payments are disabled for evaluation. Orders are placed directly, tracked live, and completed by OTP.
