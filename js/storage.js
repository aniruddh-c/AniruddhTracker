// js/storage.js

const DB_NAME = "aniruddh-tracker-db";
const DB_VERSION = 1;
const STORE_NAME = "app-state";

/**
 * Open IndexedDB connection
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

/**
 * Load state from IndexedDB
 */
export async function loadState() {
  const db = await openDB();

  return new Promise(resolve => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("state");

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => resolve(null);
  });
}

/**
 * Save state to IndexedDB
 */
export async function saveState(state) {
  const db = await openDB();

  return new Promise(resolve => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(state, "state");
    tx.oncomplete = () => resolve();
  });
}
