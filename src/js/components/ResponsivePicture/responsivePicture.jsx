import * as React from "react";

const generateSrcSet = ({ image, format, imageWidths }) =>
  imageWidths.map((n) => `${image}-${n}w.${format} ${n}w`).join(",");

function ResponsivePicture({
  image,
  alt,
  caption,
  lazyload,
  width,
  height,
  className,
  crossOrigin,
  formats,
  availableWidths,
}) {
  const src = `${image}.jpg`;
  const sizes = "(min-width: 90em) 90em, calc(100vw - 1em)";
  const defaultFormat = formats.find(
    (n) => n === "jpg" || n === "jpeg" || n === "png"
  );
  const additionalFormats =
    formats.filter((n) => !(n === "jpg" || n === "jpeg" || n === "png")) || [];
  const imageWidths =
    availableWidths && availableWidths.length ? availableWidths : [width];

  return (
    <picture>
      {additionalFormats.map((n) => (
        <source
          key={n}
          type={`image/${n}`}
          srcSet={generateSrcSet({ image, format: n, imageWidths })}
          sizes={sizes}
        />
      ))}
      <img
        src={src}
        srcSet={generateSrcSet({ image, format: defaultFormat, imageWidths })}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        title={caption}
        className={className}
        loading={lazyload ? "lazy" : "auto"}
        decoding="async"
        crossOrigin={crossOrigin}
      />
    </picture>
  );
}

export default ResponsivePicture;
