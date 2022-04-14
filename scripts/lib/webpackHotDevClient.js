/* eslint-disable import/no-import-module-exports */
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import launchEditorEndpoint from "react-dev-utils/launchEditorEndpoint";
import {
  dismissBuildError,
  reportBuildError,
  setEditorHandler,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors,
} from "react-error-overlay";
import hotClient from "webpack-hot-middleware/client";

setEditorHandler((errorLocation) => {
  const fileName = encodeURIComponent(errorLocation.fileName);
  const lineNumber = encodeURIComponent(errorLocation.lineNumber || 1);
  fetch(
    // Keep in sync with react-dev-utils/errorOverlayMiddleware
    `${launchEditorEndpoint}?fileName=${fileName}&lineNumber=${lineNumber}`
  );
});

hotClient.useCustomOverlay({
  showProblems(_type, errors) {
    const formatted = formatWebpackMessages({
      errors,
      warnings: [],
    });

    reportBuildError(formatted.errors[0]);
  },
  clear() {
    dismissBuildError();
  },
});

hotClient.setOptionsAndConnect({
  name: "client",
  reload: true,
});

startReportingRuntimeErrors({
  filename: "/assets/client.js",
});

if (module.hot) {
  module.hot.dispose(stopReportingRuntimeErrors);
}
