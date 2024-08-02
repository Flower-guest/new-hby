class localCache {
  setCache(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  getCache(key: string) {
    const value = window.localStorage.getItem(key);
    if (value && value !== "undefined") return JSON.parse(value);
  }
  setEncryption(key: string, value: any) {
    window.localStorage.setItem(key, btoa(JSON.stringify(value)));
  }
  getEncryption(key: string) {
    const value = window.localStorage.getItem(key);
    if (value) return JSON.parse(atob(value));
  }
  clearCache() {
    window.localStorage.clear(); // 清除所有缓存
  }
  deleteCache(key: string) {
    window.localStorage.removeItem(key);
  }

  setSession(key: string, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
  getSession(key: string) {
    const value = window.sessionStorage.getItem(key);
    if (value) return JSON.parse(value);
  }
  setSessionEncryption(key: string, value: any) {
    window.sessionStorage.setItem(key, btoa(JSON.stringify(value)));
  }
  getSessionEncryption(key: string) {
    const value = window.sessionStorage.getItem(key);
    if (value) return JSON.parse(atob(value));
  }
  deleteSession(key: string) {
    window.sessionStorage.removeItem(key);
  }
}

export default new localCache();
