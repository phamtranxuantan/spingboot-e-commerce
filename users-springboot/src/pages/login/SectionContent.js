import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOGIN, LOGIN_GOOGLE } from "../../api/apiService";
import { UserContext } from "../../context/UserContext";

const SectionContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUserEmail } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { email, password };
        try {
            const response = await LOGIN(body);
            if (response && response.data) {
                const token = response.data['jwt-token'];
                if (token) {
                    localStorage.setItem("authToken", token);
                    localStorage.setItem("userEmail", email); // Lưu email vào localStorage
                    setUserEmail(email); // Cập nhật context
                    toast.success("Đăng nhập thành công");
                    navigate("/");
                } else {
                    toast.error("Không tìm thấy token trong phản hồi");
                }
            } else if (response && response.data && response.data.error === "token_expired") {
                toast.error("Token đã hết hạn, vui lòng đăng nhập lại");
                navigate("/Login");
            } else {
                toast.error("Phản hồi đăng nhập thiếu dữ liệu");
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại: " + error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const response = await LOGIN_GOOGLE();
            if (response && response.googleLoginUrl) {
                window.location.href = response.googleLoginUrl; // Chuyển hướng người dùng đến URL đăng nhập Google
            } else {
                toast.error("Không nhận được URL đăng nhập Google");
            }
        } catch (error) {
            toast.error("Đăng nhập Google thất bại: " + error.message);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh" }}>
            <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4">Đăng nhập</h4>
                    <form onSubmit={handleSubmit}>
                        <a className="btn btn-facebook btn-block mb-2">
                            <i className="fab fa-facebook-f"></i> &nbsp; Sign in with Facebook
                        </a>
                        <a id="google" className="btn btn-google btn-block mb-4" onClick={handleGoogleSignIn}>
                            <i className="fab fa-google"></i> &nbsp; Sign in with Google
                        </a>
                        <div className="form-group">
                            <input
                                name="email"
                                className="form-control"
                                placeholder="Username"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* <div className="form-group">
                            <a href="#" className="float-right">Quên mật khẩu?</a>
                            <label className="float-left custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" defaultChecked />
                                <div className="custom-control-label"> Ghi nhớ </div>
                            </label>
                        </div> */}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Đăng nhập </button>
                        </div>
                    </form>
                </div>
            </div>
            <p className="text-center mt-4">Nếu bạn chưa có tài khoản? <Link to="/Register">Đăng ký</Link></p>
            <br />
        </section>
    );
};

export default SectionContent;