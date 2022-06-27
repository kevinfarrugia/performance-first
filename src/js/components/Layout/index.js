import { connect } from "react-redux";

import { selectMeta, selectPath } from "../App/selectors";
import Component from "./layout";

const mapStateToProps = (state, ownProps) => ({
  meta: selectMeta(state, ownProps),
  path: selectPath(state, ownProps),
});

const Layout = connect(mapStateToProps, null)(Component);

export default Layout;
