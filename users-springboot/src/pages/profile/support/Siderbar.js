/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { GET_ALL, POST_ADD } from "../../../api/apiService"; // Import hàm POST_ADD để gọi API POST

const Siderbar = ({ setSelectedAdmin }) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await GET_ALL("users/chat/admins");
        setAdmins(response);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleClickChangeAdmin = async (admin) => {
    setSelectedAdmin(admin);

    // Lấy email của user từ localStorage
    const userEmail = localStorage.getItem("userEmail");

    try {
        // Gọi API để cập nhật trạng thái "đang chat với ai" bằng RequestParam
        await POST_ADD(`users/chat/update-state?user=${encodeURIComponent(userEmail)}&admin=${encodeURIComponent(admin.email)}`);
        console.log(`Cập nhật trạng thái chat: User ${userEmail} đang chat với Admin ${admin.email}`);
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái chat:", error);
    }
  };

  return (
    <div style={{ width: "300px", overflow: "hidden" }} className="bg-white d-flex flex-column vh-100">
    
      <header className="p-2 border-bottom border-secondary d-flex justify-content-between align-items-center bg-primary text-white">
        <h1 className="h5 fw-bold mb-0" style={{ fontSize: "14px" }}>Hỗ trợ</h1>
        <button id="menuButton" className="btn text-white" style={{ fontSize: "12px" }}>
          <i className="bi bi-three-dots"></i>
        </button>
      </header>

     
      <div className="overflow-auto flex-grow-1 p-2" style={{ maxHeight: "calc(100vh - 40px)" }}>
        {admins.map((admin, index) => (
          <div
            key={index}
            onClick={() => handleClickChangeAdmin(admin)}
            className="d-flex align-items-center mb-2 p-1 rounded border border-light"
            style={{ cursor: "pointer", fontSize: "12px" }}
          >
            <div className="me-2">
              <img
                src={`http://localhost:8080/api/public/users/imageUser/${admin.imageUser}`}
                alt="Admin Avatar"
                className="rounded-circle border"
                width="30"
                height="30"
              />
            </div>
            <div className="flex-grow-1">
              <h2 className="h6 fw-semibold mb-0" style={{ fontSize: "12px" }}>
                {admin.lastName} {admin.firstName} 
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Siderbar;
