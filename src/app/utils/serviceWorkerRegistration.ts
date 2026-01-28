// Service Worker Registration Utility

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error);
      });
  }
}

// IndexedDB helpers for offline storage
export class OfflineStorage {
  private dbName = 'financelife-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('pending-expenses')) {
          db.createObjectStore('pending-expenses', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('category', 'category', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('groups')) {
          db.createObjectStore('groups', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async addPendingExpense(expense: any) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pending-expenses'], 'readwrite');
      const store = transaction.objectStore('pending-expenses');
      const request = store.add(expense);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingExpenses() {
    if (!this.db) await this.init();
    
    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(['pending-expenses'], 'readonly');
      const store = transaction.objectStore('pending-expenses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePendingExpense(id: number) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pending-expenses'], 'readwrite');
      const store = transaction.objectStore('pending-expenses');
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveExpense(expense: any) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['expenses'], 'readwrite');
      const store = transaction.objectStore('expenses');
      const request = store.add(expense);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllExpenses() {
    if (!this.db) await this.init();
    
    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(['expenses'], 'readonly');
      const store = transaction.objectStore('expenses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async syncPendingData() {
    const pendingExpenses = await this.getPendingExpenses();
    
    if (!navigator.onLine) {
      console.log('Offline - cannot sync now');
      return;
    }

    for (const expense of pendingExpenses) {
      try {
        // In a real app, this would call your API
        // await fetch('/api/expenses', { method: 'POST', body: JSON.stringify(expense) });
        
        // For now, just move to main storage
        await this.saveExpense(expense);
        await this.deletePendingExpense(expense.id);
        
        console.log('Synced expense:', expense.id);
      } catch (error) {
        console.error('Failed to sync expense:', error);
      }
    }
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorage();

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - syncing data...');
    offlineStorage.syncPendingData().catch(console.error);
  });
}
