import _ from "lodash";

export const cookies = {
  set: (name: string, value: string, days: number = 7): void => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  },
  get: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookiesArray = document.cookie.split(';');
    const cookie = _.find(cookiesArray, (c) => _.startsWith(c.trim(), nameEQ));

    return cookie ? cookie.trim().substring(nameEQ.length) : null;
  },
  remove: (name: string): void => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  },
};
