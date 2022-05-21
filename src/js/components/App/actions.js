import {
  APP_ERROR,
  APP_LOADING,
  SET_DEFERRED_PROMPT,
  SET_META,
  SET_PATH,
} from "./constants";

export const setIsLoading = (data) => ({
  type: APP_LOADING,
  data,
});

export const setIsError = (data) => ({
  type: APP_ERROR,
  data,
});

export const setDeferredPrompt = (data) => ({
  type: SET_DEFERRED_PROMPT,
  data,
});

export const setPath = (data) => ({
  type: SET_PATH,
  data,
});

export const setMeta = (data) => ({
  type: SET_META,
  data,
});
