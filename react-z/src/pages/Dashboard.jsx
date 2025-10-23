import axios from "axios";
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
    if (!token) navigate("/Login", { replace: true });
  }, [navigate]);

  const handleSquareClick = (event, pageName) => {
    const color = window.getComputedStyle(event.currentTarget).backgroundColor;
    setSelectedColor(color);
    setSelectedPage(pageName);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${api_url}/api/data`, {
          auth: {
            username: "devuser",
            password: "devpass1234",
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched JSON data:", response.data);
        console.log("Home Page image URL:", response.data.images.homePage);
      } catch (error) {
        if (error.response) {
          console.error(
            "Server responded with error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error in request setup:", error.message);
        }
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
                  Updating the image on this page:{" "}
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
          <div className="square--main">
            <div
              className="homepage_sq squares"
              onClick={(e) => handleSquareClick(e, "Homepage")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="homepage_txt txt">Home Page</div>
          </div>

          <div className="square--main">
            <div
              className="formpage_sq squares"
              onClick={(e) => handleSquareClick(e, "Form Page")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="formpage_txt txt">Form Page</div>
          </div>

          <div className="square--main">
            <div
              className="profilepage_sq squares"
              onClick={(e) => handleSquareClick(e, "Profile Page")}
            >
              <div className="top_notch"></div>
            </div>
            <div className="profilepage_txt txt">Profile Page</div>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
