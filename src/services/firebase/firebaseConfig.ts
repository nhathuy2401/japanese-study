import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseConfig(): FirebaseAppConfig {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC0iXxfkb-Y-_1B906Hq-aueRP2qaVRHUo',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'study-2cf98.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'study-2cf98',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'study-2cf98.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '687289920457',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:687289920457:web:4c908a4123d9b8ba515618',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return !!config.projectId && config.projectId === 'study-2cf98';
}

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseAppInstance) {
    const config = getFirebaseConfig();
    firebaseAppInstance = getApps().length === 0 ? initializeApp(config) : getApp();
  }
  return firebaseAppInstance;
}

export function getFirestoreDb(): Firestore {
  if (!firestoreInstance) {
    const app = getFirebaseApp();
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}
