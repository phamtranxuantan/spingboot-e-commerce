import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GET_ALL, PUT_EDIT } from "../../api/apiService";
import { FaEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const SettingProfile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        imageUser: '' 
    });

    const [image, setImage] = useState(null);
    const [isEdit, setEdit] = useState(false); 

    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await GET_ALL(`users/email/${encodeURIComponent(userEmail)}`);
                setUser(response);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Lỗi khi lấy dữ liệu người dùng!');
            }
        };

        fetchUserData();
    }, [userEmail]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơư\s]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!user.firstName || !user.lastName || !user.mobileNumber) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (!nameRegex.test(user.firstName) || !nameRegex.test(user.lastName)) {
            toast.error('Họ và tên chỉ được chứa chữ cái (có dấu) và khoảng trắng!');
            return;
        }

        if (!phoneRegex.test(user.mobileNumber)) {
            toast.error('Số điện thoại chỉ được chứa 10 chữ số!');
            return;
        }

        try {
            await PUT_EDIT(`users/${encodeURIComponent(userEmail)}`, user);
            toast.success('Cập nhật thông tin thành công!');
            setEdit(false); 
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('Lỗi khi cập nhật thông tin!');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("imageUser", file);

        try {
            await axios.put(
                `http://localhost:8080/api/public/users/${encodeURIComponent(userEmail)}/imageUser`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setUser({ ...user, imageUser: file.name });
            setImage(file);
            toast.success('Cập nhật ảnh thành công!');
        } catch (error) {
            toast.error("Error updating image.");
            console.error(error);
        }
    };

    return (
        <div className="container-fluid px-4">
            <div className="row">
                <main className="col-12">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="mb-4">
                                <h3 className="h6 fw-bold text-uppercase">Hồ sơ của tôi</h3>
                                <p className="text-secondary">Quản lý thông tin</p>
                            </div>

                            <form className="row g-4 align-items-start">
                                <div className="col-md-9">
                                    <div className="row mb-3">
                                        <div className="col-md-6 form-group">
                                            <label>Họ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                value={user.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Phạm"
                                                readOnly={!isEdit} 
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label>Tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                value={user.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Trần Xuân Tân"
                                                readOnly={!isEdit}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6 form-group">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="mobileNumber"
                                                value={user.mobileNumber}
                                                onChange={handleInputChange}
                                                placeholder="0123456789"
                                                readOnly={!isEdit}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                            disabled={!isEdit} 
                                        >
                                            Lưu thay đổi
                                        </button>

                                       
                                        <button
                                            type="button"
                                            onClick={() => setEdit(!isEdit)}
                                            className="btn btn-warning d-flex align-items-center gap-2 fw-bold"
                                        >
                                            {isEdit ? (
                                                <>
                                                    <MdCancel /> Hủy
                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit /> Sửa
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-3 text-center">
                                    <div className="card p-3">
                                        <div className="position-relative d-flex justify-content-center">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(image)
                                                        : `http://localhost:8080/api/public/users/imageUser/${user.imageUser}`
                                                }
                                                alt="User Avatar"
                                                className="rounded-circle border img-thumbnail"
                                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                            />
                                            <label
                                                htmlFor="image"
                                                className="position-absolute bottom-0 end-0 mb-1 me-1 bg-light border rounded-circle p-2 shadow-sm"
                                                style={{ cursor: "pointer" }}
                                                title="Tải ảnh lên"
                                            >
                                                <i className="bi bi-upload text-primary"></i>
                                                <input
                                                    onChange={handleImageChange}
                                                    className="d-none"
                                                    type="file"
                                                    accept="image/*"
                                                    name="image"
                                                    id="image"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-muted small mt-2 mb-0">
                                            Dung lượng tối đa 1MB. Định dạng: JPEG, PNG,JPG
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingProfile;
