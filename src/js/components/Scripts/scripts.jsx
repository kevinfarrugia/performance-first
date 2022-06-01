import * as React from "react";

function Scripts({ scripts, legacyScripts }) {
  return (
    <>
      {scripts &&
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
              <script key={key} type="module" src={src} />
            )
        )}
      {legacyScripts &&
        legacyScripts.map(
          ({ key, props: { type, src } }) =>
            type !== "application/json" && (
              <script key={key} type="nomodule" src={src} />
            )
        )}
    </>
  );
}

export default Scripts;
