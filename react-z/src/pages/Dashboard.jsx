import axios from "axios";
import "../Dash.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
  const [selectedPage, setSelectedPage] = useState("Homepage");
  const [selectedImage, setSelectedImage] = useState(null);

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
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(`${api_url}/api/data`, {
          auth: { username: "devuser", password: "devpass1234" },
          headers: { "Content-Type": "application/json" },
        });

        if (data?.images) {
          setImages(data.images);
          if (data.images.homePage) {
            setSelectedPage("Homepage");
            setPreviewImage(data.images.homePage);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      // console.log("Selected file:", file);
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="main--section">
        <div className="section1">
          <div className="section1_main">
            <div className="left_1">
              <p className="sel_img">Select an image to upload!</p>

              <button
                onClick={() => document.getElementById("fileInput").click()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                Choose from Library
              </button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setPreviewImage(imageUrl);
                    // console.log("Selected file:", file);
                  }
                }}
              />

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
                  //  FORM PAGE / PROFILE PAGE Condition
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
            <div className="homepage_txt txt">Home Page</div>
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
          </div>

          {/* Formpage square */}
          <div className="square--main">
            <div className="formpage_txt txt">Form Page</div>
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
          </div>

          {/* Profile page square */}
          <div className="square--main">
            <div className="profilepage_txt txt">Profile Page</div>
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
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
