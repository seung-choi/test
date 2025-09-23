// utils/storage.ts

const isClient = typeof window !== "undefined";

const storage = {
  session: {
    get(key: string) {
      if (!isClient) return null;
      return key ? window.sessionStorage.getItem(key) : window.sessionStorage;
    },
    set(data: Record<string, any> = {}) {
      if (!isClient) return;
      const keys = Object.keys(data);
      keys.forEach((key) => {
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
    },
    clearExcept(keysToKeep: string[]) {
      if (!isClient) return;
      const allKeys = Object.keys(window.sessionStorage);
      allKeys.forEach((key) => {
        if (!keysToKeep.includes(key)) {
          window.sessionStorage.removeItem(key);
        }
      });
    },
  },

  local: {
    get(key: string) {
      if (!isClient) return null;
      return key ? window.localStorage.getItem(key) : window.localStorage;
    },
    set(data: Record<string, any> = {}) {
      if (!isClient) return;
      const keys = Object.keys(data);
      keys.forEach((key) => {
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
    },
    clearExcept(keysToKeep: string[]) {
      if (!isClient) return;
      const allKeys = Object.keys(window.localStorage);
      allKeys.forEach((key) => {
        if (!keysToKeep.includes(key)) {
          window.localStorage.removeItem(key);
        }
      });
    },
    lengthExcept(keysToExclude: string[] = []) {
      if (!isClient) return 0;
      const allKeys = Object.keys(window.localStorage);
      return allKeys.filter((key) => !keysToExclude.includes(key)).length;
    },
  },
};

export default storage;
