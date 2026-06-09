import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Fooditem from "../components/Fooditem";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FooditemCarousel from "../components/FooditemCarousel";
import VideoIntro from '../components/VideoIntro';
import Meta from "../components/Meta";
import { listFooditems } from "../actions/fooditemActions";
import { getUserDetails } from "../actions/userActions";
import ChefImagesCircle from "../components/ChefImagesCircle";
import axios from "axios";
import RecommendedSection from "./RecommendedSection";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const chefLogin = useSelector((state) => state.chefLogin);

  const fooditemList = useSelector((state) => state.fooditemList);
  const { loading, error, fooditems, page, pages } = fooditemList;

  const [chefs, setChefs] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const fetchChefs = async (address = "") => {
    try {
      const url = address ? "/api/chefs?address=" + encodeURIComponent(address) : "/api/chefs";
      const { data } = await axios.get(url);
      console.log("Fetched chefs data:", data);
      const normalizedChefs = data.map(chef => {
        if (chef.profilePic && !chef.profilePic.startsWith("http") && !chef.profilePic.startsWith("/uploads/")) {
          chef.profilePic = "/uploads/" + chef.profilePic;
        }
        return chef;
      });
      setChefs(normalizedChefs);
    } catch (error) {
      console.error("Error fetching chefs:", error);
    }
  };

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      if (userInfo && userInfo.token) {
        try {
          const config = {
            headers: {
              Authorization: "Bearer " + userInfo.token,
            },
          };
          const { data } = await axios.get("/api/orders/myorders", config);
          const delivered = data.filter(order =>
            order.orderItems.some(item => item.status === "delivered")
          );
          setDeliveredOrders(delivered);
        } catch (error) {
          console.error("Error fetching delivered orders:", error);
        }
      }
    };

    fetchDeliveredOrders();
  }, [userInfo]);

  useEffect(() => {
    const userAddress = userInfo && userInfo.address ? userInfo.address : "";
    dispatch(listFooditems(keyword, pageNumber, 8, userAddress));
  }, [dispatch, keyword, pageNumber, userInfo]);

  useEffect(() => {
    fetchChefs(keyword || "");
  }, [keyword]);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(getUserDetails(userInfo._id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("refreshChefs") === "true") {
      fetchChefs(keyword || "");
      params.delete("refreshChefs");
      const newSearch = params.toString();
      window.history.replaceState({}, document.title, location.pathname + (newSearch ? "?" + newSearch : ""));
    }
  }, [location, keyword]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      const url = new URL(window.location);
      url.searchParams.delete("scrollTo");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  return (
    <div>
      <>
        <Meta />
        {!keyword ? (
          <>
            <VideoIntro />
            <FooditemCarousel id="home-menu" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", marginBottom: "20px" }}>
              <h2 style={{ fontWeight: "bold" }}>Our chefs</h2>
              <Link to="/chefs" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "20px", border: "2px solid #f8b400", cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: "24px", height: "24px", color: "#f8b400" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ChefImagesCircle chefs={chefs.slice(-4).reverse()} />
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", marginBottom: "20px" }}>
              <h2 style={{ fontWeight: "bold" }}>Our chefs</h2>
              <Link to="/chefs" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "20px", border: "2px solid #f8b400", cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: "24px", height: "24px", color: "#f8b400" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ChefImagesCircle chefs={chefs.slice(-4).reverse()} />
            <Link to="/" className="btn btn-light">Go Back</Link>
          </>
        )}
        <h1 id="latest-items">Latest Fooditems</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row>
              {fooditems.map((fooditem) => (
                <Col key={fooditem._id} sm={12} md={6} lg={4} xl={3}>
                  <Fooditem fooditem={fooditem} />
                </Col>
              ))}
            </Row>
            {/* <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} /> */}
            {userInfo && deliveredOrders.length > 0 && (
              <RecommendedSection baseFooditemId={deliveredOrders[0].orderItems[0].fooditem} />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default HomeScreen;
