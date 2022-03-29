import { toPage } from "../adapter";

const toHome = (data) => {
  if (data) {
    return {
      ...toPage(data),
    };
  }
  return null;
};

// eslint-disable-next-line import/prefer-default-export
export { toHome };
