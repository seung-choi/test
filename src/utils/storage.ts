const isClient = typeof window !== 'undefined';

type StorageType = 'session' | 'local';

interface StorageHandler {
  get(key: string): string | Storage | null;
  set(data: Record<string, any>): void;
  remove(key: string): void;
  clear(): void;
  clearExcept(keysToKeep: string[]): void;
  lengthExcept?(keysToExclude: string[]): number;
}

const createStorageHandler = (storageType: StorageType): StorageHandler => {
  const getStorage = () =>
    storageType === 'session' ? window.sessionStorage : window.localStorage;

  return {
    get(key: string) {
      if (!isClient) return null;
      return key ? getStorage().getItem(key) : getStorage();
    },

    set(data: Record<string, any> = {}) {
      if (!isClient) return;
      Object.entries(data).forEach(([key, value]) => {
        getStorage().setItem(key, value !== undefined ? value : '');
      });
    },

    remove(key: string) {
      if (!isClient || !key) return;
      getStorage().removeItem(key);
    },

    clear() {
      if (!isClient) return;
      getStorage().clear();
    },

    clearExcept(keysToKeep: string[]) {
      if (!isClient) return;
      const allKeys = Object.keys(getStorage());
      allKeys.forEach((key) => {
        if (!keysToKeep.includes(key)) {
          getStorage().removeItem(key);
        }
      });
    },

    lengthExcept(keysToExclude: string[] = []) {
      if (!isClient) return 0;
      const allKeys = Object.keys(getStorage());
      return allKeys.filter((key) => !keysToExclude.includes(key)).length;
    },
  };
};

const storage = {
  session: createStorageHandler('session'),
  local: createStorageHandler('local'),
};

export default storage;
