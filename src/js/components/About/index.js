import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import Component from "./about";
import { getAbout, getAboutPage } from "./actions";
import { selectAbout, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  about: selectAbout,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetAbout: (data) => dispatch(getAbout(data)),
  onGetAboutPage: (data) => dispatch(getAboutPage(data)),
});

const About = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default About;

export const getAboutSSR = (store, { path, match, query, url, route }) =>
  store.dispatch(
    getAboutPage({
      path,
      match,
      query,
      url,
      route,
    })
  );
