import CryptoJS from 'crypto-js';
import _ from 'lodash';

const SECRET_KEY = 'GODPLEASEHELPMEKEEPIT'; // Khóa bảo mật để mã hóa

const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const storage = {
  set: (key: string, value: any): void => {
    const jsonString = _.isPlainObject(value) ? JSON.stringify(value) : value;
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  },

  get: (key: string): any => {
    const encrypted = localStorage.getItem(key);

    // Kiểm tra nếu giá trị từ localStorage là null
    if (!encrypted) {
      return null;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!isJsonString(decrypted)) {
        return decrypted;
      }

      const data = JSON.parse(decrypted);

      // Kiểm tra nếu object này có thuộc tính 'expiresIn' và đã hết hạn
      if (_.has(data, 'expiresIn') && Date.now() > data.expiresIn) {
        console.log('Token has expired');
        storage.remove(key);  // Xóa nếu hết hạn
        return null;
      }

      return data;
    } catch (e) {

      console.log(`Error decrypting data from key: ${key}`);

      console.error('Error decrypting data', e);
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};
