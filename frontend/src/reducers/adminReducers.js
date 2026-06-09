import {
  ADMIN_STATS_REQUEST,
  ADMIN_STATS_SUCCESS,
  ADMIN_STATS_FAIL,
} from "../constants/adminConstants";
export const adminStatsReducer = (state = { stats: {} }, action) => {
  switch (action.type) {
    case ADMIN_STATS_REQUEST:
      return { loading: true, stats: {} };
    case ADMIN_STATS_SUCCESS:
      return { loading: false, stats: action.payload };
    case ADMIN_STATS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
// New reducers for chef applications
export const chefApplicationsListReducer = (state = { applications: [] }, action) => {
  switch (action.type) {
    case "CHEF_APPLICATIONS_LIST_REQUEST":
      return { loading: true, applications: [] };
    case "CHEF_APPLICATIONS_LIST_SUCCESS":
      return { loading: false, applications: action.payload };
    case "CHEF_APPLICATIONS_LIST_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const chefApplicationApproveReducer = (state = {}, action) => {
  switch (action.type) {
    case "CHEF_APPLICATION_APPROVE_REQUEST":
      return { loading: true };
    case "CHEF_APPLICATION_APPROVE_SUCCESS":
      return { loading: false, success: true, application: action.payload };
    case "CHEF_APPLICATION_APPROVE_FAIL":
      return { loading: false, error: action.payload };
    case "CHEF_APPLICATION_APPROVE_RESET":
      return {};
    default:
      return state;
  }
};

export const chefApplicationRejectReducer = (state = {}, action) => {
  switch (action.type) {
    case "CHEF_APPLICATION_REJECT_REQUEST":
      return { loading: true };
    case "CHEF_APPLICATION_REJECT_SUCCESS":
      return { loading: false, success: true };
    case "CHEF_APPLICATION_REJECT_FAIL":
      return { loading: false, error: action.payload };
    case "CHEF_APPLICATION_REJECT_RESET":
      return {};
    default:
      return state;
  }
};
