import { connect } from "react-redux";
import { compose } from "redux";

import Component from "./home";
import { getHomePage } from "./slice";

const mapDispatchToProps = (dispatch) => ({
  onGetHomePage: (data) => dispatch(getHomePage(data)),
});

const Home = compose(connect(null, mapDispatchToProps))(Component);

export default Home;
