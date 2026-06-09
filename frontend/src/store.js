import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  fooditemListReducer,
  fooditemDetailsReducer,
  fooditemDeleteReducer,
  fooditemCreateReducer,
  fooditemUpdateReducer,
  fooditemReviewCreateReducer,
  fooditemTopRatedReducer,
  fooditemChefListReducer,
  fooditemListByChefReducer,
} from "./reducers/fooditemReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  chefLoginReducer,
  chefRegisterReducer,
  chefListReducer,
} from "./reducers/chefReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from "./reducers/orderReducers";
import { reviewCreateReducer, reviewListReducer } from "./reducers/reviewReducers";
import {
  chefApplicationsListReducer,
  chefApplicationApproveReducer,
  chefApplicationRejectReducer,
  adminStatsReducer,
} from "./reducers/adminReducers";

const reducer = combineReducers({
  fooditemList: fooditemListReducer,
  fooditemChefList: fooditemChefListReducer,
  fooditemListByChef: fooditemListByChefReducer,
  fooditemDetails: fooditemDetailsReducer,
  fooditemDelete: fooditemDeleteReducer,
  fooditemCreate: fooditemCreateReducer,
  fooditemUpdate: fooditemUpdateReducer,
  fooditemReviewCreate: fooditemReviewCreateReducer,
  fooditemTopRated: fooditemTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  chefLogin: chefLoginReducer,
  chefRegister: chefRegisterReducer,
  chefList: chefListReducer,
  chefApplicationsList: chefApplicationsListReducer,
  chefApplicationApprove: chefApplicationApproveReducer,
  chefApplicationReject: chefApplicationRejectReducer,
  adminStats: adminStatsReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  reviewCreate: reviewCreateReducer,
  reviewList: reviewListReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const chefInfoFromStorage = localStorage.getItem("chefInfo")
  ? JSON.parse(localStorage.getItem("chefInfo"))
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
  chefLogin: { chefInfo: chefInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
