import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectMeta, selectPath } from "../App/reducer";
import Component from "./layout";

const mapStateToProps = createStructuredSelector({
  meta: selectMeta,
  path: selectPath,
});

const Layout = connect(mapStateToProps, null)(Component);

export default Layout;
