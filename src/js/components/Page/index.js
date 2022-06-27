import { connect } from "react-redux";

import { setMeta, setPath } from "../App/slice";
import Component from "./page";
import { makeSelectIsReady, makeSelectPage } from "./selectors";

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
  onSetPath: (data) => dispatch(setPath(data)),
  onSetMeta: (data) => dispatch(setMeta(data)),
});

const Page = connect(makeMapStateToProps, mapDispatchToProps)(Component);

export default Page;
