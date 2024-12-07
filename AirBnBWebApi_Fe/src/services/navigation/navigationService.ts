// src/utils/navigationHelper.ts
let navigateFunction: any = null;

export const setNavigate = (navigate: any) => {
  navigateFunction = navigate;
};

export const navigate = (path: string, options?: object) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  }
};
