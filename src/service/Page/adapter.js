import { toImage } from "../adapter";

export const toMeta = (data) => {
  if (data) {
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      creator: data.creator,
      date: data.date,
      image: data.thumbnail,
    };
  }
  return null;
};

export const toBanner = (data) => {
  if (data) {
    return {
      caption: data.caption,
      image: data.image,
      alt: data.alt,
      width: data.width,
      height: data.height,
      formats: data.formats,
      availableWidths: data.availableWidths,
    };
  }
  return null;
};

export const toPage = (data) => {
  if (data) {
    return {
      id: data.id,
      name: data.name,
      title: data.title,
      html: data.html,
      path: data.path,
      thumbnail: toImage(data.thumbnail),
      banner: toBanner(data.banner),
      meta: toMeta({
        ...data.meta,
        image: data.thumbnail ? data.thumbnail.imageUrl : "",
      }),
    };
  }
  return null;
};
