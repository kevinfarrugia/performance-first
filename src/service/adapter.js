export const toImage = (data) => {
  if (data) {
    return {
      src: data.imageUrl,
      alt: data.alternateText,
      width: data.width,
      height: data.height,
    };
  }
  return null;
};

export const toResponsiveImage = (data) => {
  if (data && data.length > 0) {
    const defaultImage = data[0];
    const responsiveImageData = {
      src: defaultImage.imageUrl,
      alt: defaultImage.alternateText,
      srcset: `${defaultImage.imageUrl} ${defaultImage.width}w`,
    };
    // If there any images left over, append their contents to the srcset
    for (let i = 1; i < data.length; i += 1) {
      responsiveImageData.srcset = `${responsiveImageData.srcset}, ${data[i].imageUrl} ${data[i].width}w`;
    }
    return responsiveImageData;
  }
  return null;
};

export const toMeta = (data) => {
  if (data) {
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      creator: data.creator,
      date: data.date,
      thumbnail: data.thumbnail,
    };
  }
  return null;
};

export const toVideo = (data) => {
  if (data) {
    return {
      title: data.title,
      src: data.videoUrl,
    };
  }
  return null;
};

export const toBanners = (data) => {
  if (data && data.length) {
    return data.map((n) => {
      const banner = {
        id: n.id,
        images: toResponsiveImage(n.images),
      };

      if (n.videoWebM) {
        banner.videoWebM = toVideo(n.videoWebM);
        banner.useVideo = true;
      }
      if (n.videoMp4) {
        banner.videoMp4 = toVideo(n.videoMp4);
        banner.useVideo = true;
      }

      return banner;
    });
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
      url: data.url,
      thumbnail: toImage(data.thumbnail),
      banners: toBanners(data.banners),
      meta: toMeta({
        ...data.meta,
        thumbnail: data.thumbnail ? data.thumbnail.imageUrl : "",
      }),
    };
  }
  return null;
};
