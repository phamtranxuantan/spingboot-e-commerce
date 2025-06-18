import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { setUserEmail } = useContext(UserContext);

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const authorizationCode = urlParams.get('code');
            console.log("Authorization Code:", authorizationCode); // Thêm ghi nhật ký để kiểm tra mã ủy quyền
            if (authorizationCode) {
                try {
                    const response = await fetch(`http://localhost:8080/api/public/oauth2/callback/google?code=${authorizationCode}`);
                    const data = await response.json();
                    const token = data['jwt-token'];
                    const email = data['email']; // Giả sử email được trả về từ API
                    if (token) {
                        localStorage.setItem('authToken', token);
                        localStorage.setItem('userEmail', email); // Lưu email vào localStorage
                        setUserEmail(email); // Cập nhật context
                        toast.success("Đăng nhập Google thành công");
                        navigate('/');
                    } else {
                        toast.error("Không tìm thấy token trong phản hồi");
                    }
                } catch (error) {
                    toast.error("Xử lý callback Google thất bại: " + error.message);
                }
            }
        };

        handleGoogleCallback();
    }, [navigate, setUserEmail]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ClipLoader color="#36d7b7" size={60} />
        </div>
    );
};

export default GoogleCallback;
