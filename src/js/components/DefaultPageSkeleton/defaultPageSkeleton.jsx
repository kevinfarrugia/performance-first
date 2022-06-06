import * as React from "react";

import styles from "./styles.scss";

function DefaultPageSkeleton() {
  return (
    <>
      <div className={styles.bannerSkeleton} />
      <div className={styles.contentSkeleton} />
    </>
  );
}

export default DefaultPageSkeleton;
