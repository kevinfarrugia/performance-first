import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import { getHome, getHomePage } from "./actions";
import Component from "./home";
import { selectHome, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  home: selectHome,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetHome: (data) => dispatch(getHome(data)),
  onGetHomePage: (data) => dispatch(getHomePage(data)),
});

const Home = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default Home;

export const getHomeSSR = (store) => store.dispatch(getHomePage());
