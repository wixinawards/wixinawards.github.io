// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDykhdH96mZu4-8Z0gWRwdKClY0143Ky2Q",
  authDomain: "wixinawards-4eadb.firebaseapp.com",
  databaseURL: "https://wixinawards-4eadb-default-rtdb.firebaseio.com",
  projectId: "wixinawards-4eadb",
  storageBucket: "wixinawards-4eadb.firebasestorage.app",
  messagingSenderId: "711140377308",
  appId: "1:711140377308:web:f6e6a9e500f3f5a9d82a19",
  measurementId: "G-H311HG35JR"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Sign in anonymously for read access
await signInAnonymously(auth);

// Local password validation (no CORS issues)
const ADMIN_PASSWORD = "wixinrocks2025"; // Change this to your desired password

export async function initializeData(defaultData) {
  const dataRef = ref(database, 'awards');
  const snapshot = await get(dataRef);
  if (!snapshot.exists()) {
    await set(dataRef, defaultData);
  }
}

export function loadData(callback) {
  const dataRef = ref(database, 'awards');
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

export async function saveData(data, adminToken) {
  if (!adminToken) {
    throw new Error('You must be logged in as admin to make changes');
  }

  try {
    const dataRef = ref(database, 'awards');
    await set(dataRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

export async function validatePassword(password) {
  // Simple local validation (no CORS issues)
  if (password === ADMIN_PASSWORD) {
    return { 
      success: true, 
      token: "admin_" + Date.now() // Generate a simple token
    };
  }
  return { success: false, error: 'Incorrect password' };
}
