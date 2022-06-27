import { connect } from "react-redux";
import { compose } from "redux";

import Component from "./about";
import { selectAbout, selectIsReady } from "./selectors";
import { getAboutPage } from "./thunks";

const mapStateToProps = (state, ownProps) => ({
  about: selectAbout(state, ownProps),
  isReady: selectIsReady(state, ownProps),
});

const mapDispatchToProps = (dispatch) => ({
  onGetAboutPage: (data) => dispatch(getAboutPage(data)),
});

const About = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default About;
