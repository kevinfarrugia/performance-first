const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const launchEditorEndpoint = require("react-dev-utils/launchEditorEndpoint");
const {
  dismissBuildError,
  reportBuildError,
  setEditorHandler,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors,
} = require("react-error-overlay");
const hotClient = require("webpack-hot-middleware/client");

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
