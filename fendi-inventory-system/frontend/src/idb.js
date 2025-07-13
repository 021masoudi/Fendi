import { openDB } from 'idb';

const dbPromise = openDB('fendi-inventory-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('sales')) {
      db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('products')) {
      db.createObjectStore('products', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('inventory')) {
      db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const idb = {
  async get(storeName, key) {
    return (await dbPromise).get(storeName, key);
  },
  async getAll(storeName) {
    return (await dbPromise).getAll(storeName);
  },
  async put(storeName, value) {
    return (await dbPromise).put(storeName, value);
  },
  async delete(storeName, key) {
    return (await dbPromise).delete(storeName, key);
  },
  async clear(storeName) {
    return (await dbPromise).clear(storeName);
  },
};
