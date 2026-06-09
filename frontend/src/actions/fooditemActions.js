import axios from "axios";
import {
  FOODITEM_LIST_REQUEST,
  FOODITEM_LIST_SUCCESS,
  FOODITEM_LIST_FAIL,
  FOODITEM_DETAILS_REQUEST,
  FOODITEM_DETAILS_SUCCESS,
  FOODITEM_DETAILS_FAIL,
  FOODITEM_DELETE_REQUEST,
  FOODITEM_DELETE_SUCCESS,
  FOODITEM_DELETE_FAIL,
  FOODITEM_CREATE_REQUEST,
  FOODITEM_CREATE_SUCCESS,
  FOODITEM_CREATE_FAIL,
  FOODITEM_UPDATE_REQUEST,
  FOODITEM_UPDATE_SUCCESS,
  FOODITEM_UPDATE_FAIL,
  FOODITEM_CREATE_REVIEW_REQUEST,
  FOODITEM_CREATE_REVIEW_SUCCESS,
  FOODITEM_CREATE_REVIEW_FAIL,
  FOODITEM_TOP_REQUEST,
  FOODITEM_TOP_SUCCESS,
  FOODITEM_TOP_FAIL,
  FOODITEM_CHEF_LIST_REQUEST,
  FOODITEM_CHEF_LIST_SUCCESS,
  FOODITEM_CHEF_LIST_FAIL,
  FOODITEM_LIST_BY_CHEF_REQUEST,
  FOODITEM_LIST_BY_CHEF_SUCCESS,
  FOODITEM_LIST_BY_CHEF_FAIL,
} from "../constants/fooditemConstants";

export const listFooditems = (keyword = "", pageNumber = "", pageSize = 10) => async (dispatch) => {
  try {
    dispatch({ type: FOODITEM_LIST_REQUEST });

    const { data } = await axios.get(`/api/fooditems?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`);

    dispatch({
      type: FOODITEM_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listFooditemsByChef = (chefId) => async (dispatch) => {
  try {
    dispatch({ type: FOODITEM_LIST_BY_CHEF_REQUEST });

    const { data } = await axios.get(`/api/fooditems/chef/${chefId}`);

    dispatch({
      type: FOODITEM_LIST_BY_CHEF_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_LIST_BY_CHEF_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listFooditemDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: FOODITEM_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/fooditems/${id}`);

    dispatch({
      type: FOODITEM_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listChefFooditems = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FOODITEM_CHEF_LIST_REQUEST });

    const state = getState();
    const userLogin = state.userLogin || {};
    const chefLogin = state.chefLogin || {};
    const userInfo = userLogin.userInfo;
    const chefInfo = chefLogin.chefInfo;

    const token = chefInfo?.token || userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`/api/fooditems/chef`, config);

    dispatch({
      type: FOODITEM_CHEF_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    // Removed logout dispatch to avoid logging out user on authorization errors
    dispatch({
      type: FOODITEM_CHEF_LIST_FAIL,
      payload: message,
    });
  }
};

export const createFooditem = (formData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FOODITEM_CREATE_REQUEST,
    });

    const state = getState();
    const userLogin = state.userLogin || {};
    const chefLogin = state.chefLogin || {};
    const userInfo = userLogin.userInfo;
    const chefInfo = chefLogin.chefInfo;

    const token = chefInfo?.token || userInfo?.token;

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`/api/fooditems/chef/create`, formData, config);

    dispatch({
      type: FOODITEM_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateFooditem = (fooditem) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FOODITEM_UPDATE_REQUEST,
    });

    const state = getState();
    const userLogin = state.userLogin || {};
    const chefLogin = state.chefLogin || {};
    const userInfo = userLogin.userInfo;
    const chefInfo = chefLogin.chefInfo;

    const token = chefInfo?.token || userInfo?.token;

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`/api/fooditems/chef/${fooditem._id}`, fooditem.formData, config);

    dispatch({
      type: FOODITEM_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteFooditem = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FOODITEM_DELETE_REQUEST,
    });

    const state = getState();
    const userLogin = state.userLogin || {};
    const chefLogin = state.chefLogin || {};
    const userInfo = userLogin.userInfo;
    const chefInfo = chefLogin.chefInfo;

    const token = chefInfo?.token || userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`/api/fooditems/chef/${id}`, config);

    dispatch({
      type: FOODITEM_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createFooditemReview = (fooditemId, review) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FOODITEM_CREATE_REVIEW_REQUEST,
    });

    const state = getState();
    const userLogin = state.userLogin || {};
    const userInfo = userLogin.userInfo;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.post(`/api/fooditems/${fooditemId}/reviews`, review, config);

    dispatch({
      type: FOODITEM_CREATE_REVIEW_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listTopFooditems = () => async (dispatch) => {
  try {
    dispatch({ type: FOODITEM_TOP_REQUEST });

    const { data } = await axios.get(`/api/fooditems/top`);

    dispatch({
      type: FOODITEM_TOP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FOODITEM_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
