import {
  CHEF_LOGIN_REQUEST,
  CHEF_LOGIN_SUCCESS,
  CHEF_LOGIN_FAIL,
  CHEF_LOGOUT,
  CHEF_REGISTER_REQUEST,
  CHEF_REGISTER_SUCCESS,
  CHEF_REGISTER_FAIL,
  CHEF_LIST_REQUEST,
  CHEF_LIST_SUCCESS,
  CHEF_LIST_FAIL,
} from "../constants/chefConstants";

export const chefLoginReducer = (state = {}, action) => {
  console.log("chefLoginReducer action:", action);
  switch (action.type) {
    case CHEF_LOGIN_REQUEST:
      return { loading: true };
    case CHEF_LOGIN_SUCCESS:
      console.log("chefLoginReducer success payload:", action.payload);
      return { loading: false, chefInfo: action.payload };
    case CHEF_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case CHEF_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const chefRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case CHEF_REGISTER_REQUEST:
      return { loading: true };
    case CHEF_REGISTER_SUCCESS:
      return { loading: false, chefInfo: action.payload };
    case CHEF_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const chefListReducer = (state = { chefs: [] }, action) => {
  switch (action.type) {
    case CHEF_LIST_REQUEST:
      return { loading: true, chefs: [] };
    case CHEF_LIST_SUCCESS:
      return { loading: false, chefs: action.payload };
    case CHEF_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
