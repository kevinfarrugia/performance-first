import { connect } from "react-redux";
import { compose } from "redux";

import { getPage } from "../Page/thunks";
import Component from "./defaultPage";

const mapDispatchToProps = (dispatch) => ({
  onGetPage: (data) => dispatch(getPage(data)),
});

const DefaultPage = compose(connect(null, mapDispatchToProps))(Component);

export default DefaultPage;
