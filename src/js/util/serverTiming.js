import onHeaders from "on-headers";

// create server-timing entry for duration of server-side rendering
const createServerTiming = (name) => (_req, res) => {
  // eslint-disable-next-line no-param-reassign
  const start = process.hrtime();

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

  return [start, stop];
};

// eslint-disable-next-line import/prefer-default-export
export default createServerTiming;
