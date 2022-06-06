import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import reducerRegistry from "../../reducerRegistry";
import Component from "./about";
import { getAboutPage } from "./actions";
import { REDUCER_NAME } from "./constants";
import reducer, { selectAbout, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  about: selectAbout,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetAboutPage: (data) => dispatch(getAboutPage(data)),
});

const About = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default About;

reducerRegistry.register(REDUCER_NAME, reducer);
