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
            <React.Fragment key={key}>
              <script type="module" src={src} />
              <script nomodule src={src} defer />
            </React.Fragment>
          )
      )) ||
    null
  );
}

export default Scripts;
