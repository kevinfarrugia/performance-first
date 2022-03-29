import {
  APP_ERROR,
  APP_LOADING,
  SET_COMPETITION_ID,
  SET_DEFERRED_PROMPT,
  SET_META,
  SET_TITLE,
  SET_URL,
} from "./constants";

export const isLoading = (data) => ({
  type: APP_LOADING,
  data,
});

export const isError = (data) => ({
  type: APP_ERROR,
  data,
});

export const setDeferredPrompt = (data) => ({
  type: SET_DEFERRED_PROMPT,
  data,
});

export const setUrl = (data) => ({
  type: SET_URL,
  data,
});

export const setMeta = (data) => ({
  type: SET_META,
  data,
});

export const setTitle = (data) => ({
  type: SET_TITLE,
  data,
});

export const setCompetitionId = (data) => ({
  type: SET_COMPETITION_ID,
  data,
});
