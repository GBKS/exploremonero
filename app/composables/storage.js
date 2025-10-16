export const storage = {
  getLocal(key, defaultValue) {
    let result = null;
    if (this.localAvailable()) {
      const resultString = localStorage.getItem(key);
      if (resultString && resultString.length > 0) {
        try {
          result = JSON.parse(resultString);
        } catch (e) {
          console.error('Error parsing localStorage item:', key, e);
          result = null;
        }
      }
    }

    if (result === null && result !== false && defaultValue) {
      result = defaultValue;
    }

    return result;
  },

  setLocal(key, data) {
    if (this.localAvailable()) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Error setting localStorage item:', key, e);
      }
    }
  },

  localAvailable() {
    return window.localStorage;
  }
};