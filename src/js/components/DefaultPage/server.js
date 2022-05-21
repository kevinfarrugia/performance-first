import { getPage } from "../Page/actions";

const getPageSSR = (store, { path }) => store.dispatch(getPage({ path }));

export default getPageSSR;
