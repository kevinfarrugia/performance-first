import NodeCache from "node-cache";
import { match } from "path-to-regexp";

import { toRoutes } from "./adapter";
import { get } from "./service";

const CACHE_DURATION = 300;

// cache using a stale-while-revalidate strategy
const cache = new NodeCache({
  stdTTL: CACHE_DURATION,
  deleteOnExpire: false,
  useClones: false,
});

const refreshCache = async (key) => {
  get(key)
    .then(({ lang, routes }) => {
      cache.set(lang, Object.freeze(routes));
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};

const getData = async (key) => {
  const value = cache.get(key);
  // if no routing table is cached,
  // then it will retrieve a new routing table
  if (!value) {
    await refreshCache(key);
    return cache.get(key);
  }
  // Otherwise, we retrieve the cached version
  return value;
};

const getRoutingTable = async () => {
  const routes = await getData("en");
  return toRoutes(routes);
};

const isValidPath = async (urlPath) => {
  const routes = await getRoutingTable();
  return routes.find((n) => match(n.url)(urlPath));
};

const getUrl = async (docType) => {
  const routingTable = await getRoutingTable();
  return routingTable.find((item) => item.value === docType).url;
};

const getUrls = async (docTypes) => {
  const routingTable = await getRoutingTable();
  const results = routingTable.filter(
    (item) => docTypes.indexOf(item.value) > -1
  );
  // convert into object
  const obj = {};

  for (let i = results.length - 1; i >= 0; i -= 1) {
    obj[results[i].value] = results[i].url;
  }
  return obj;
};

cache.on("expired", (key, data) => {
  // replenish the cache
  refreshCache(key);
  // serve stale data until cache is replenished
  cache.set(key, data);
});

export { getData, refreshCache, getUrls, getUrl, getRoutingTable, isValidPath };
