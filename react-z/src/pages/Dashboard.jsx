import axios from "axios";
import "../Dash.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

  const [images, setImages] = useState({
    homePage: "",
    formPage: "",
    profilePage: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/Login");
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) navigate("/Login", { replace: true });
  }, [navigate]);

  const handleSquareClick = (event, pageName) => {
    setSelectedPage(pageName);

    switch (pageName) {
      case "Homepage":
        setPreviewImage(images.homePage);
        break;
      case "Form Page":
        setPreviewImage(images.formPage);
        break;
      case "Profile Page":
        setPreviewImage(images.profilePage);
        break;
      default:
        setPreviewImage("");
    }
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

        // console.log("Fetched JSON data:", response.data);
        if (response.data && response.data.images) {
          setImages(response.data.images);
        }
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
              {previewImage && (
                <p>
                  Updating the image on this page:{" "}
                  <strong>{selectedPage}</strong>
                </p>
              )}
            </div>
            <div className="right_1">
              <div className="preview_square">
                {selectedPage === "Homepage" && previewImage ? (
                  // HOMEPAGE — full image
                  <img
                    src={previewImage}
                    alt="Homepage Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />
                ) : (selectedPage === "Form Page" ||
                    selectedPage === "Profile Page") &&
                  previewImage ? (
                  //  FORM PAGE / PROFILE PAGE
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                      borderRadius: "15px",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ height: "40.5%", width: "100%" }}>
                      <img
                        src={previewImage}
                        alt={`${selectedPage} Preview`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        height: "59.5%",
                        width: "100%",
                        backgroundColor: "whitesmoke",
                      }}
                    ></div>
                  </div>
                ) : (
                  // DEFAULT (no image)
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#eee",
                      borderRadius: "15px",
                    }}
                  ></div>
                )}
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
              style={{
                backgroundImage: `url(${images.homePage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <div className="top_notch_home"></div>
            </div>
            <div className="homepage_txt txt">Home Page</div>
          </div>

          {/* Formpage square */}
          <div className="square--main">
            <div
              className="formpage_sq squares"
              onClick={(e) => handleSquareClick(e, "Form Page")}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flex: "0 0 40%",
                  backgroundImage: `url(${images.formPage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div
                style={{
                  flex: "1",
                  backgroundColor: "whitesmoke",
                }}
              ></div>
              <div className="top_notch"></div>
            </div>
            <div className="formpage_txt txt">Form Page</div>
          </div>

          {/* Profile page square */}
          <div className="square--main">
            <div
              className="profilepage_sq squares"
              onClick={(e) => handleSquareClick(e, "Profile Page")}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flex: "0 0 40%",
                  backgroundImage: `url(${images.profilePage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div
                style={{
                  flex: "1",
                  backgroundColor: "whitesmoke",
                }}
              ></div>
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
