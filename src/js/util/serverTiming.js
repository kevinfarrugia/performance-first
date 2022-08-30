import onHeaders from "on-headers";

// create and append server-timing entry to response headers
const createServerTiming = (name) => (_req, res) => {
  const start = process.hrtime();
  const startTimeMs = start[0] * 1000 + start[1] / 1000000;

  const stop = ({ description, precision } = {}) => {
    const end = process.hrtime(start);
    onHeaders(res, () => {
      const duration = end[0] * 1000 + end[1] / 1000000;
      res.append(
        "Server-Timing",
        `${name};dur=${duration.toFixed(precision || 1)}${
          description ? `;desc="${description}"` : ""
        }`
      );
    });
  };

  return [startTimeMs, stop];
};

export default createServerTiming;
