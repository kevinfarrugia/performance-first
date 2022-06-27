import { getPage } from "../Page/thunks";

const getPageSSR = (store, { path }) => store.dispatch(getPage({ path }));

export default getPageSSR;
