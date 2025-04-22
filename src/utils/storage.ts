// utils/storage.ts

const isClient = typeof window !== 'undefined';

const storage = {
  session: {
    get(key: string) {
      if (!isClient) return null;
      return key ? window.sessionStorage.getItem(key) : window.sessionStorage;
    },
    set(data: Record<string, any> = {}) {
      if (!isClient) return;
      const keys = Object.keys(data);
      keys.forEach(key => {
        const value = data[key];
        window.sessionStorage.setItem(key, value !== undefined ? value : "");
      });
    },
    remove(key: string) {
      if (!isClient || !key) return;
      window.sessionStorage.removeItem(key);
    },
    clear() {
      if (!isClient) return;
      window.sessionStorage.clear();
    }
  },

  local: {
    get(key: string) {
      if (!isClient) return null;
      return key ? window.localStorage.getItem(key) : window.localStorage;
    },
    set(data: Record<string, any> = {}) {
      if (!isClient) return;
      const keys = Object.keys(data);
      keys.forEach(key => {
        const value = data[key];
        window.localStorage.setItem(key, value !== undefined ? value : "");
      });
    },
    remove(key: string) {
      if (!isClient || !key) return;
      window.localStorage.removeItem(key);
    },
    clear() {
      if (!isClient) return;
      window.localStorage.clear();
    }
  }
};

export default storage;