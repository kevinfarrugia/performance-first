import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import Component from "./about";
import { getAboutPage } from "./actions";
import { selectAbout, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  about: selectAbout,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetAboutPage: (data) => dispatch(getAboutPage(data)),
});

const About = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default About;
