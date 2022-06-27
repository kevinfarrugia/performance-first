import { connect } from "react-redux";

import Component from "./page";
import { makeSelectIsReady, makeSelectPage } from "./selectors";
import { resetPage } from "./slice";

const makeMapStateToProps = () => {
  const selectPage = makeSelectPage();
  const selectIsReady = makeSelectIsReady();
  const mapStateToProps = (state, ownProps) => ({
    page: selectPage(state, ownProps),
    isReady: selectIsReady(state, ownProps),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  onResetPage: (data) => dispatch(resetPage(data)),
});

const Page = connect(makeMapStateToProps, mapDispatchToProps)(Component);

export default Page;
