import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/userActions";
import { logoutChef } from "../actions/chefActions";
import axios from "axios";
import { Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const chefLogin = useSelector((state) => state.chefLogin);
  const { chefInfo } = chefLogin;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const logoutHandler = () => {
    if (userInfo) {
      dispatch(logout());
      window.location.href = "/";
    } else if (chefInfo) {
      dispatch(logoutChef());
      window.location.href = "/login-chef";
    }
  };

  // Fetch search results when searchTerm changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        axios
          .get(`/api/fooditems?keyword=${searchTerm.trim()}`)
          .then((res) => {
            // Filter results to only those whose name starts with the search term (case-insensitive)
            const term = searchTerm.trim().toLowerCase();
            const filtered = (res.data.fooditems || []).filter(item => {
              const nameMatch = item.name.toLowerCase().startsWith(term);
              const chefName = item.user && item.user.name ? item.user.name.toLowerCase() : "";
              const kitchenName = item.user && item.user.kitchenName ? item.user.kitchenName.toLowerCase() : "";
              const chefMatch = chefName.startsWith(term);
              const kitchenMatch = kitchenName.startsWith(term);
              return nameMatch || chefMatch || kitchenMatch;
            });
            setSearchResults(filtered);
            setShowResults(filtered.length > 0);
          })
          .catch((err) => {
            console.error("Error fetching search results:", err);
            setSearchResults([]);
            setShowResults(false);
          });
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom header for chef login and signup pages
  if (
    location.pathname === "/login-chef" ||
    location.pathname === "/signup-chef"
  ) {
    return (
      <header style={{ backgroundColor: "black", padding: "10px 0" }}>
        <Container className="d-flex align-items-center justify-content-center">
          <img
            src="/images/chef-spoons-rolling.gif"
            alt="Chef Spinning"
            style={{ width: "60px", height: "60px", marginRight: "15px" }}
          />
          <LinkContainer to="/">
            <Navbar.Brand style={{ color: "white", fontSize: "1.5rem" }}>
              <img
                alt=""
                src="/images/socialKitchen_white.png"
                width="50"
                height="50"
                style={{ marginRight: "10px", borderRadius: "50%", objectFit: "cover" }}
              />
              DeliciouslyMade
            </Navbar.Brand>
          </LinkContainer>
        </Container>
      </header>
    );
  }

  // Navbar for chef dashboard with same styling as other pages, without profile and vertical bar
  if (chefInfo) {
    // Only show chef navbar on chef-specific routes
    const chefPaths = ["/chef/dashboard", "/login-chef", "/signup-chef"];
    if (chefPaths.includes(location.pathname)) {
      return (
        <header>
          <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    alt=""
                    src="/images/socialKitchen_white.png"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  DeliciouslyMade
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  <NavDropdown title={chefInfo.name} id="username">
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
      );
    }
  }

  // Navbar for admin user
  if (userInfo && userInfo.isAdmin) {
    return (
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>
                <img
                  alt=""
                  src="/images/socialKitchen_white.png"
                  width="50"
                  height="50"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ color: "white" }}>DeliciouslyMade</span>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <LinkContainer to="/admin/dashboard">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <NavDropdown title="Admin" id="adminmenu" menuvariant="dark">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/cheflist">
                    <NavDropdown.Item>Chefs</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/fooditemlist">
                    <NavDropdown.Item>Fooditems</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/faq">
                    <NavDropdown.Item>FAQ</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/reviews">
                    <NavDropdown.Item>Reviews</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
                <NavDropdown title={userInfo.name} id="adminuser" menuvariant="dark">
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  // Default header for other users
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                alt=""
                src="/images/socialKitchen_white.png"
                width="50"
                height="50"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              DeliciouslyMade
            </Navbar.Brand>
          </LinkContainer>
          {/* Search Bar */}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              padding: "0 0 0 0",
              position: "relative",
              maxWidth: "400px",
              width: "100%",
            }}
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "5px 40px 5px 10px",
                borderRadius: "4px",
                border: "2px solid #000",
                fontSize: "1rem",
                backgroundImage:
                  "url('data:image/svg+xml;utf8,<svg fill=%22none%22 stroke=%22black%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2211%22 cy=%2211%22 r=%227%22/><line x1=%2216.656%22 y1=%2216.657%22 x2=%2221%22 y2=%2221%22/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                backgroundSize: "20px 20px",
                boxSizing: "border-box",
                paddingRight: "40px",
              }}
            />
            {showResults && searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {searchResults.map((item) => (
                  <Link
                    to={`/fooditem/${item._id}`}
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={() => setShowResults(false)}
                  >
                    <img
                      src={
                        item.image.startsWith("http") ||
                        item.image.startsWith("/uploads/") ||
                        item.image.startsWith("/images/")
                          ? item.image
                          : `/uploads/${item.image}`
                      }
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "10px",
                        borderRadius: "4px",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div>₹{item.price}</div>
                      <div style={{ fontSize: "0.8rem", color: "#555" }}>
                        Chef: {item.user ? item.user.kitchenName || item.user.name : "Unknown"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/collaborate">
                <Nav.Link>Collaborate</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact">
                <Nav.Link>Contact</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link>Cart</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <LinkContainer to="/orders">
                    <Nav.Link>Orders</Nav.Link>
                  </LinkContainer>
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link style={{ color: "white" }}>Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
