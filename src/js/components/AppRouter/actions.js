import { getRoutingTable } from "../../../service/Router";
import { SET_ROUTES } from "./constants";

const setRoutes = (data) => ({
  type: SET_ROUTES,
  data,
});

const fetchRoutes = (data) => (dispatch) =>
  getRoutingTable(data)
    .then((response) => {
      dispatch(setRoutes(response));
      return response;
    })
    .catch((error) => {
      throw error;
    });

// eslint-disable-next-line import/prefer-default-export
export { fetchRoutes };
