const storage = {
  session: {
    get(key: string) {
      return key ? window.sessionStorage.getItem(key) : window.sessionStorage;
    },
    set(data: Record<string, any> = {}) {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        keys.forEach(key => {
          const value = data[key];
          window.sessionStorage.setItem(key, value !== undefined ? value : "");
        });
      }
    },
    remove(key: string) {
      if (key) {
        window.sessionStorage.remove(key);
      }
    },
    clear() {
      window.sessionStorage.clear();
    }
  },

  local: {
    get(key: string) {
      return key ? window.localStorage.getItem(key) : window.localStorage;
    },
    set(data: Record<string, any> = {}) {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        keys.forEach(key => {
          const value = data[key];
          window.localStorage.setItem(key, value !== undefined ? value : "");
        });
      }
    },
    remove(key: string) {
      if (key) {
        window.localStorage.remove(key);
      }
    },
    clear() {
      window.localStorage.clear();
    }
  }
};

export default storage;