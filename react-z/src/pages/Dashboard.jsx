import "../Dash.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/Login");
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    console.log("Token of dash:", token);
    if (!token) {
      navigate("/Login", { replace: true });
    }
  }, [navigate]);

  // code to Get background color of clicked div
  const handleSquareClick = async (event, pageName) => {
    const color = window.getComputedStyle(event.currentTarget).backgroundColor;
    setSelectedColor(color);
    setSelectedPage(pageName);
  };

  useEffect(() => {
    const fetchImage = async () => {
      const API_URL = `${api_url}/api/data`;
      console.log("API_URL:", API_URL);

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add auth header if your API needs it
            // Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        console.log("Response status:", response.status);

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Fetched JSON data:", data);
          // Example: log homePage image URL
          console.log("Home Page image URL:", data.images.homePage);
        } else {
          const text = await response.text();
          console.error("Expected JSON but got:", text.slice(0, 500));
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="p-6 text-center">
      <div className="main--section">
        <div className="section1">
          <div className="section1_main">
            <div className="left_1">
              <p>Select an image to upload!</p>

              {selectedColor && (
                <p>
                  Updating the image on this page:
                  <strong>{selectedPage}</strong>
                </p>
              )}
            </div>
            <div className="right_1">
              <div
                className="preview_square"
                style={{
                  backgroundColor: selectedColor || "#eee",
                  transition: "background-color 0.4s ease",
                }}
              >
                <div className="top_notch"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="section2">
          {/* Homepage square */}
          <div className="square--main">
            <div
              className="homepage_sq squares"
              onClick={(e) => handleSquareClick(e, "Homepage")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="homepage_txt txt">Home Page</div>
          </div>

          {/* Formpage square */}
          <div className="square--main">
            <div
              className="formpage_sq squares"
              onClick={(e) => handleSquareClick(e, "Form Page")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="formpage_txt txt">Form Page</div>
          </div>

          {/* Profilepage square */}
          <div className="square--main">
            <div
              className="profilepage_sq squares"
              onClick={(e) => handleSquareClick(e, "Profile Page")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="profilepage_txt txt">Profile Page</div>
          </div>

          {/* section2 div closes */}
        </div>
      </div>

      {/* Log Out Button - placed at the end */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
