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
    const response = await fetch('https://us-central1-wixinawards-4eadb.cloudfunctions.net/validateAndSave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: adminToken,
        data: data
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to save');
    }

    return result;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

export async function validatePassword(password) {
  try {
    const response = await fetch('https://us-central1-wixinawards-4eadb.cloudfunctions.net/validatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating password:', error);
    throw error;
  }
}
