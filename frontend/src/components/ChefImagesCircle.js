import React from "react";
import { Link } from "react-router-dom";

const BACKEND_BASE_URL = "http://localhost:5001";

const ChefImagesCircle = ({ chefs }) => {
  console.log("ChefImagesCircle received chefs:", chefs);

  if (!chefs || chefs.length === 0) {
    return <div style={{ textAlign: "center", marginBottom: "40px" }}>No chefs available</div>;
  }

  return (
    <div style={styles.container}>
      {chefs.map((chef) => {
        const isTopRatedKelgade = chef.name.toLowerCase() === "kelgade";
        const imagePath = chef.profilePic || chef.chefImage || "";
        let imageUrl = "/images/default-chef.png";
        if (imagePath && typeof imagePath === "string") {
          if (imagePath.startsWith("http")) {
            imageUrl = imagePath;
          } else if (imagePath.startsWith("/uploads/") || imagePath.startsWith("/images/")) {
            imageUrl = BACKEND_BASE_URL + imagePath;
          } else {
            imageUrl = BACKEND_BASE_URL + "/uploads/" + imagePath;
          }
        }
        console.log(`Chef: ${chef.name}, profilePic: ${chef.profilePic}, imageUrl used: ${imageUrl}`);
        return (
          <Link
            key={chef._id}
            to={`/chef/${chef._id}/fooditems`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                ...styles.box,
                borderColor: isTopRatedKelgade ? "#ff4500" : "#f8b400",
                boxShadow: isTopRatedKelgade
                  ? "0 0 15px rgba(255, 69, 0, 0.8)"
                  : "0 0 10px rgba(248, 180, 0, 0.6)",
              }}
            >
              <div style={styles.imageWrapper}>
                <img
                  src={imageUrl}
                  alt={chef.name}
                  style={styles.image}
                />
              </div>
              <div style={styles.chefName}>
                {chef.name}
                {isTopRatedKelgade && <span style={styles.topRatedBadge}>Top Rated</span>}
              </div>
              {chef.address && (
                <div style={isTopRatedKelgade ? styles.kitchenNameHighlighted : styles.kitchenName}>
                  {chef.address}
                </div>
              )}
              {chef.kitchenName && (
                <div style={isTopRatedKelgade ? styles.kitchenNameHighlighted : styles.kitchenName}>
                  {chef.kitchenName}
                </div>
              )}
              {chef.about && <div style={styles.about}>{chef.about}</div>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "40px",
    marginTop: "50px",
    flexWrap: "wrap",
  },
  box: {
    padding: "10px",
    border: "2px solid #f8b400",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "280px",
    height: "400px",
    boxShadow: "0 0 10px rgba(248, 180, 0, 0.6)",
    position: "relative",
  },
  imageWrapper: {
    position: "relative",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid #f8b400",
    boxShadow: "0 0 10px rgba(248, 180, 0, 0.6)",
    marginTop: "-70px", // half of box height to lift image half above the box
    backgroundColor: "#fff",
  },
  image: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
  },
  chefName: {
    marginTop: "15px", // reduced space between circle image and name
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333",
    textAlign: "center",
  },
  kitchenName: {
    marginTop: "15px",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#666",
    textAlign: "center",
  },
  kitchenNameHighlighted: {
    marginTop: "15px",
    fontWeight: "700",
    fontSize: "1rem",
    color: "#ff4500",
    textAlign: "center",
  },
  about: {
    marginTop: "15px",
    fontSize: "0.85rem",
    color: "#777",
    textAlign: "center",
    maxWidth: "280px",
    height: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  topRatedBadge: {
    marginLeft: "8px",
    backgroundColor: "#ff4500",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "2px 6px",
    borderRadius: "12px",
    verticalAlign: "middle",
  },
};

export default ChefImagesCircle;
