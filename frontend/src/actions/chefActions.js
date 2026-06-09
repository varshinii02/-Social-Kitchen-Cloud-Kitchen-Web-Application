import axios from "axios";
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

export const loginChef = (email, phone, password) => async (dispatch) => {
  try {
    dispatch({
      type: CHEF_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/chefs/login",
      { email, phone, password },
      config
    );

    dispatch({
      type: CHEF_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("chefInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: CHEF_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logoutChef = () => (dispatch) => {
  localStorage.removeItem("chefInfo");
  dispatch({ type: CHEF_LOGOUT });
  document.location.href = "/login-chef";
};

export const registerChef = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: CHEF_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post("/api/chefs/signup", formData, config);

    dispatch({
      type: CHEF_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: CHEF_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("chefInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: CHEF_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listChefs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHEF_LIST_REQUEST });

    const { data } = await axios.get(`/api/chefs`); // Corrected API endpoint

    dispatch({
      type: CHEF_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CHEF_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
