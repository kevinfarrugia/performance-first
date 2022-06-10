import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import { getHomePage } from "./actions";
import Component from "./home";
import { selectHome, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  home: selectHome,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetHomePage: (data) => dispatch(getHomePage(data)),
});

const Home = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default Home;
