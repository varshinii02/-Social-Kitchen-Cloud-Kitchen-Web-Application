import React from "react";
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import DeliveredOrdersScreen from "./screens/DeliveredOrdersScreen";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Screens
import HomeScreen from "./screens/HomeScreen";
import FooditemScreen from "./screens/FooditemScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import TrackOrderScreen from "./screens/TrackOrderScreen";

import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import CollaborateScreen from "./screens/CollaborateScreen";

// Admin Screens
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import FooditemListScreen from "./screens/FooditemListScreen";
import FooditemEditScreen from "./screens/FooditemEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import CombinedChefApplicationsScreen from "./screens/admin/CombinedChefApplicationsScreen";
import FAQScreen from "./screens/admin/FAQScreen";
import AdminOrderListScreen from "./screens/admin/AdminOrderListScreen";
import AdminReviewListScreen from "./screens/admin/AdminReviewListScreen";

// Chef Screens
import ChefSignupScreen from "./screens/ChefSignupScreen";
import ChefLoginScreen from "./screens/ChefLoginScreen";
import ChefDashboardScreen from "./screens/ChefDashboardScreen";
import ChefMenuScreen from "./screens/ChefMenuScreen";
import ChefListScreen from "./screens/ChefListScreen";

import ChefApplicationSuccessScreen from "./screens/ChefApplicationSuccessScreen";
import ChefApplicationScreen from "./screens/ChefApplicationScreen";

import ChefFooditemsScreen from "./screens/ChefFooditemsScreen";

const AppWrapper = () => {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === "/login-chef" || location.pathname === "/signup-chef";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="py-1">
        <Container>
          {/* Main Routes */}
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/login-chef" component={ChefLoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/signup-chef" component={ChefSignupScreen} />
          <Route path="/chef/dashboard" component={ChefDashboardScreen} />
          <Route path="/dashboard-chef/menu" component={ChefMenuScreen} />
          <Route path="/admin/dashboard" component={AdminDashboardScreen} />
          <Route path="/admin/faq" component={FAQScreen} />
          <Route path="/trackorder/:id" component={TrackOrderScreen} />
          <Route path="/orders" component={OrderListScreen} />
          <Route path="/chefs" component={ChefListScreen} />

          {/* Admin Management */}
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route path="/admin/fooditemlist" component={FooditemListScreen} exact />
          <Route path="/admin/fooditemlist/:pageNumber" component={FooditemListScreen} exact />
          <Route path="/admin/fooditem/:id/edit" component={FooditemEditScreen} />
          <Route path="/admin/orderlist" component={AdminOrderListScreen} />
          <Route path="/admin/cheflist" component={CombinedChefApplicationsScreen} />
          {/* Removed separate route for combined screen as it is now the main chefs page */}
          {/* <Route path="/admin/combined-chef-applications" component={CombinedChefApplicationsScreen} /> */}

          {/* Food and Cart */}
          <Route path="/fooditem/:id" component={FooditemScreen} />
          <Route path="/cart/:id?" component={CartScreen} />

          {/* User */}
          <Route path="/profile" component={ProfileScreen} />

          {/* Chef Applications */}
          <Route path="/chef-application" component={ChefApplicationScreen} />
          <Route path="/chef-application-success" component={ChefApplicationSuccessScreen} />
          <Route path="/admin/reviews" component={AdminReviewListScreen} />
        </Container>

        {/* Static Pages */}
        <Container fluid style={{ padding: "0px" }}>
          <Route path="/about" component={AboutScreen} />
          <Route path="/contact" component={ContactScreen} />
          <Route path="/collaborate" component={CollaborateScreen} />

          {/* Home and Search */}
          <Route path="/search/:keyword" component={HomeScreen} exact />
          <Route path="/page/:pageNumber" component={HomeScreen} exact />
          <Route path="/search/:keyword/page/:pageNumber" component={HomeScreen} exact />
          <Route path="/" component={HomeScreen} exact />
          <Route path="/chef/:id/fooditems" component={ChefFooditemsScreen} />
          <Route path="/deliveredorders" component={DeliveredOrdersScreen} />
        </Container>
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
