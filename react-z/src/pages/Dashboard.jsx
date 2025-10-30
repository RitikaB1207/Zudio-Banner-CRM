import axios from "axios";
import "../Dash.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../config";
import HeyyFanz from "../assets/HeyyFanz.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
  const [selectedPage, setSelectedPage] = useState("Homepage");
  const [images, setImages] = useState({
    homePage: "",
    formPage: "",
    profilePage: "",
  });

  // new states for confirmation popup shown at the end
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/Login");
  };

  // Redirect the user if not logged in
  useEffect(() => {
    if (!localStorage.getItem("auth_token"))
      navigate("/Login", { replace: true });
  }, [navigate]);

  // Fetch all images using GET API
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${api_url}/api/data`, {
          headers: { "Content-Type": "application/json" },
        });

        if (data?.images) {
          setImages(data.images);
          setPreviewImage(data.images.homePage || "");
        }
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    })();
  }, []);

  // Select pages on square clicks
  const handleSquareClick = (_, page) => {
    setSelectedPage(page);
    const key =
      page === "Homepage"
        ? "homePage"
        : page === "Form Page"
        ? "formPage"
        : "profilePage";
    setPreviewImage(images[key]);
  };

  // Handle file selection — only preview + ask for confirmation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setShowConfirmPopup(true);
  };

  // Confirm upload (actually hit POST IMAGE BANNER API)
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/Login");
      return;
    }

    const pageKey =
      selectedPage === "Homepage"
        ? "homePage"
        : selectedPage === "Form Page"
        ? "formPage"
        : "profilePage";

    const formData = new FormData();
    formData.append("images", selectedFile);
    formData.append("keys", pageKey);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      // Dynamic Authorization Token fetching
      let response;
      try {
        response = await axios.post(
          `${api_url}/admin/api/banner-images`,
          formData,
          { headers }
        );
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.warn("Bearer prefix rejected. retrying without it...");
          const retryHeaders = {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          };
          response = await axios.post(
            `${api_url}/admin/api/banner-images`,
            formData,
            { headers: retryHeaders }
          );
        } else {
          throw error;
        }
      }

      const data = response.data;
      const updatedUrl = data?.imageUrl || URL.createObjectURL(selectedFile);

      setImages((prev) => ({ ...prev, [pageKey]: updatedUrl }));
      setPreviewImage(updatedUrl);
      setSelectedFile(null);
      setShowConfirmPopup(false);
      console.log("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      alert(`Upload failed: ${error.response?.statusText || error.message}`);
    }
  };

  // Cancel upload (revert preview)
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setShowConfirmPopup(false);
    const key =
      selectedPage === "Homepage"
        ? "homePage"
        : selectedPage === "Form Page"
        ? "formPage"
        : "profilePage";
    setPreviewImage(images[key]);
  };

  // Render page squares
  const renderSquare = (page, image) => {
    const isHome = page === "Homepage";
    return (
      <div className="square--main" key={page}>
        <div className="txt">{page}</div>
        <div
          className="squares"
          onClick={(e) => handleSquareClick(e, page)}
          style={{
            display: "flex",
            flexDirection: isHome ? "row" : "column",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          {isHome ? (
            <div
              style={{
                flex: 1,
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <>
              <div
                style={{
                  flex: "0 0 40%",
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ flex: 1, backgroundColor: "whitesmoke" }} />
            </>
          )}
          <div className="top_notch"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 text-center">
      <div className="main--section">
        {/* -------- Left Section : choose files -------- */}
        <div className="section1">
          <div className="section1_main">
            <div className="left_1">
              <p className="sel_img">Select an image to upload!</p>

              <button
                onClick={() => document.getElementById("fileInput").click()}
                className="choose-btn"
              >
                Choose from Library
              </button>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {previewImage && (
                <p>
                  Updating the image on this page:{" "}
                  <strong>{selectedPage}</strong>
                </p>
              )}
            </div>

            {/* -------- Preview Section -------- */}
            <div className="right_1">
              <div className="preview_square">
                {previewImage ? (
                  selectedPage === "Homepage" ? (
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
                  ) : (
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
                      <div style={{ height: "40%", width: "100%" }}>
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
                          height: "60%",
                          backgroundColor: "whitesmoke",
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#eee",
                      borderRadius: "15px",
                    }}
                  />
                )}
                <div className="top_notch"></div>
                {selectedPage === "Homepage" && (
                  <>
                    <div className="heyy_Fanz_img">
                      <img src={HeyyFanz} alt="HeyyFanz" />
                    </div>
                    <div className="pop-in-div">
                      <p className="pop-in-txt">POP-IN</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* -------- Squares Section -------- */}
        <div className="section2">
          {renderSquare("Homepage", images.homePage)}
          {renderSquare("Form Page", images.formPage)}
          {renderSquare("Profile Page", images.profilePage)}
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>

      {/* -------- Confirmation Popup -------- */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Image Change?</h3>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button className="confirm-btn" onClick={handleConfirmUpload}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={handleCancelUpload}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
