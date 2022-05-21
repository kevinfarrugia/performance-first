// eslint-disable-next-line import/prefer-default-export
export const toImage = (data) => {
  if (data) {
    return {
      src: data.image,
      alt: data.alt,
      width: data.width,
      height: data.height,
    };
  }
  return null;
};
