import axios from "axios";
import {
  ADMIN_STATS_REQUEST,
  ADMIN_STATS_SUCCESS,
  ADMIN_STATS_FAIL,
} from "../constants/adminConstants";

export const getAdminStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIN_STATS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) {
      dispatch({
        type: ADMIN_STATS_FAIL,
        payload: "User not logged in",
      });
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/admin/stats", config);

    dispatch({
      type: ADMIN_STATS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_STATS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "USER_LIST_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        role: "user",
      },
    };

    const { data } = await axios.get("/api/users", config);

    dispatch({
      type: "USER_LIST_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "USER_LIST_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// New actions for chef applications

export const listChefApplications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "CHEF_APPLICATIONS_LIST_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) {
      dispatch({
        type: "CHEF_APPLICATIONS_LIST_FAIL",
        payload: "User not logged in",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/admin/chef-applications", config);

    dispatch({
      type: "CHEF_APPLICATIONS_LIST_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "CHEF_APPLICATIONS_LIST_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const approveChefApplication = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "CHEF_APPLICATION_APPROVE_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) {
      dispatch({
        type: "CHEF_APPLICATION_APPROVE_FAIL",
        payload: "User not logged in",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`/api/admin/chef-applications/${id}/approve`, {}, config);

    dispatch({
      type: "CHEF_APPLICATION_APPROVE_SUCCESS",
    });

    // Refresh the list after approval
    dispatch(listChefApplications());
  } catch (error) {
    dispatch({
      type: "CHEF_APPLICATION_APPROVE_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const rejectChefApplication = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "CHEF_APPLICATION_REJECT_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) {
      dispatch({
        type: "CHEF_APPLICATION_REJECT_FAIL",
        payload: "User not logged in",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`/api/admin/chef-applications/${id}/reject`, {}, config);

    dispatch({
      type: "CHEF_APPLICATION_REJECT_SUCCESS",
    });

    // Refresh the list after rejection
    dispatch(listChefApplications());
  } catch (error) {
    dispatch({
      type: "CHEF_APPLICATION_REJECT_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
