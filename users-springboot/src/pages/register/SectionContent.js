import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGISTER } from "../../api/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SectionContent = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || firstName.length < 5 || firstName.length > 30) {
            toast.error("Họ phải có độ dài từ 5 đến 30 ký tự và không được bỏ trống");
            return;
        }

        if (!lastName || lastName.length < 5 || lastName.length > 30) {
            toast.error("Tên phải có độ dài từ 5 đến 30 ký tự và không được bỏ trống");
            return;
        }

        if (!mobileNumber || !/^\d{10,}$/.test(mobileNumber)) {
            toast.error("Số điện thoại phải có ít nhất 10 số, chỉ chứa số và không được bỏ trống");
            return;
        }

        if (!email) {
            toast.error("Email không được bỏ trống");
            return;
        }

        if (!password) {
            toast.error("Mật khẩu không được bỏ trống");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp");
            return;
        }

        const body = {
            userId: 0,
            firstName,
            lastName,
            mobileNumber,
            email,
            password,
            roles: [
                {
                    roleId: 102,
                    roleName: "USER"
                }
            ],
            address: {
                addressId: 0,
                street: "string",
                buildingName: "string",
                city: "string",
                state: "string",
                country: "string",
                pincode: "string"
            },
            cart: {
                cartId: 0,
                totalPrice: 0,
                userEmail: email,
                products: []
            }
        };

        try {
            const response = await REGISTER(body);
            if (response && response.data) {
                toast.success("Đăng ký thành công");
                navigate("/Login");
            } else {
                toast.error("Đăng ký thất bại");
            }
        } catch (error) {
            toast.error("Đăng ký thất bại: " + error.message);
        }
    };

    return (
        <section className="section-content padding-y">
            <div className="card mx-auto" style={{ maxWidth: "520px", marginTop: "40px" }}>
                <article className="card-body">
                    <header className="mb-4"><h4 className="card-title">Đăng ký</h4></header>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="col form-group">
                                <label>Họ</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder=""
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>  
                            <div className="col form-group">
                                <label>Tên</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder=""
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>  
                        </div>  
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <small className="form-text text-muted">Chúng tôi sẽ không chia sẻ email của bạn với bất kỳ ai khác.</small>
                        </div>  
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder=""
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                        </div>  
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Tạo mật khẩu</label>
                                <input 
                                    className="form-control" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>   
                            <div className="form-group col-md-6">
                                <label>Nhập lại mật khẩu</label>
                                <input 
                                    className="form-control" 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>    
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Đăng ký </button>
                        </div>      
                        <div className="form-group"> 
                            <label className="custom-control custom-checkbox"> 
                                <input type="checkbox" className="custom-control-input" defaultChecked/> 
                                <div className="custom-control-label"> Tôi đồng ý với <a href="#">điều khoản và điều kiện</a> </div> 
                            </label>
                        </div>             
                    </form>
                </article> 
            </div> 
            <p className="text-center mt-4">Bạn đã có tài khoản? <Link to="/Login">Đăng nhập</Link></p>
            <br/>
        </section>
    );
};

export default SectionContent;