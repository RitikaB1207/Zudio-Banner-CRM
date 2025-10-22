import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

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

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>This is your dashboard page.</p>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
