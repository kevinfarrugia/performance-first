import * as React from "react";

function Scripts({ scripts }) {
  return (
    (scripts &&
      scripts.map(
        ({ key, props: { id, dangerouslySetInnerHTML, type, src } }) =>
          type === "application/json" ? (
            <script
              key={key}
              id={id}
              type={type}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            />
          ) : (
            <script key={key} src={src} defer />
          )
      )) ||
    null
  );
}

export default Scripts;
