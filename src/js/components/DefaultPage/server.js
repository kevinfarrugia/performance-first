import { getPage } from "../Page/slice";

const getPageSSR = (store, { path }) => store.dispatch(getPage({ path }));

export default getPageSSR;
