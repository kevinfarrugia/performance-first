import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import reducerRegistry from "../../reducerRegistry";
import { getHomePage } from "./actions";
import { REDUCER_NAME } from "./constants";
import Component from "./home";
import { reducer, selectHome, selectIsReady } from "./reducer";

const mapStateToProps = createStructuredSelector({
  home: selectHome,
  isReady: selectIsReady,
});

const mapDispatchToProps = (dispatch) => ({
  onGetHomePage: (data) => dispatch(getHomePage(data)),
});

const Home = compose(connect(mapStateToProps, mapDispatchToProps))(Component);

export default Home;

reducerRegistry.register(REDUCER_NAME, reducer);
