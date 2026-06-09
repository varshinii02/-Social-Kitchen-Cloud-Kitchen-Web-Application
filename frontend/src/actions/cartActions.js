import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/fooditems/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      fooditem: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock !== undefined ? data.countInStock : 0,
      qty,
      chef: data.user._id,
    },
  });

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    await axios.put(
      "/api/users/cart",
      { cartItems: getState().cart.cartItems },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
  }

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    await axios.put(
      "/api/users/cart",
      { cartItems: getState().cart.cartItems },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
  }

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

// Load cart items from backend on user login
export const loadCartFromBackend = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo) {
    const { data } = await axios.get("/api/users/cart", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    // Dispatch actions to add each item to cart
    data.forEach((item) => {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          fooditem: item.fooditem,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          chef: item.chef,
        },
      });
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  }
};

// Clear cart items on logout
export const clearCart = () => (dispatch) => {
  dispatch({
    type: CART_CLEAR_ITEMS,
  });
  localStorage.removeItem("cartItems");
};
