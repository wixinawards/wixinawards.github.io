// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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
let currentUser = null;
try {
  const userCredential = await signInAnonymously(auth);
  currentUser = userCredential.user;
} catch (error) {
  console.error('Anonymous sign-in failed:', error);
}

// Admin password stored in Firebase
const ADMIN_PASSWORD_PATH = 'admin/password';

export async function initializeData(defaultData) {
  const dataRef = ref(database, 'awards');
  try {
    const snapshot = await get(dataRef);
    if (!snapshot.exists()) {
      await set(dataRef, defaultData);
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}

export function loadData(callback) {
  const dataRef = ref(database, 'awards');
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  }, (error) => {
    console.error('Error loading data:', error);
    callback(null);
  });
}

export async function saveData(data, adminToken) {
  if (!adminToken || !adminToken.isAdmin) {
    throw new Error('You must be logged in as admin to make changes');
  }

  try {
    const dataRef = ref(database, 'awards');
    await set(dataRef, data);
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    if (error.code === 'PERMISSION_DENIED') {
      throw new Error('Permission denied. Admin access required.');
    }
    throw error;
  }
}

export async function validatePassword(password) {
  try {
    // Check password against Firebase
    const passwordRef = ref(database, ADMIN_PASSWORD_PATH);
    const snapshot = await get(passwordRef);
    
    if (!snapshot.exists()) {
      // Initialize password if it doesn't exist (first time setup)
      // You'll need to manually set this in Firebase Console initially
      return { 
        success: false, 
        error: 'Admin password not configured. Please set it in Firebase Console at admin/password' 
      };
    }
    
    const storedPassword = snapshot.val();
    
    if (password === storedPassword) {
      const token = {
        isAdmin: true,
        timestamp: Date.now(),
        uid: currentUser?.uid
      };
      
      sessionStorage.setItem('adminToken', JSON.stringify(token));
      
      return { 
        success: true, 
        token: token
      };
    }
    
    return { 
      success: false, 
      error: 'Incorrect password' 
    };
  } catch (error) {
    console.error('Error validating password:', error);
    return { 
      success: false, 
      error: 'Error checking password. Make sure Firebase rules allow reading admin/password' 
    };
  }
}

export function getStoredAdminToken() {
  const stored = sessionStorage.getItem('adminToken');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAdminToken() {
  sessionStorage.removeItem('adminToken');
}