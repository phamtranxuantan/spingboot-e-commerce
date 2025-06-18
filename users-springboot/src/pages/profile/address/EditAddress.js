import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { GET_ALL, GET_ID_ADDRESS, PUT_EDIT } from "../../../api/apiService";
import MapAddress from "../../../components/MapAddress";

export const EditAddress = ({ isOpenEdit, setIsOpenEdit, setIsRefresh, addressId }) => {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        address_detail: "",
        province_id: "",
        district_id: "",
        ward_id: "",
        name: "",
        phone: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [coords, setCoords] = useState(null);
    const [currentAddress, setCurrentAddress] = useState("");
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        GET_ALL("ghn/provinces")
            .then(response => {
                setProvinces(response);
            })
            .catch(error => {
                console.error("Failed to fetch provinces:", error);
            });
    }, []);

    useEffect(() => {
        if (formValues.province_id) {
            GET_ALL(`ghn/districts?provinceId=${formValues.province_id}`)
                .then(response => {
                    setDistricts(response);
                    setWards([]);
                })
                .catch(error => {
                    console.error("Failed to fetch districts:", error);
                });
        }
    }, [formValues.province_id]);

    useEffect(() => {
        if (formValues.district_id) {
            GET_ALL(`ghn/wards?districtId=${formValues.district_id}`)
                .then(response => {
                    setWards(response);
                })
                .catch(error => {
                    console.error("Failed to fetch wards:", error);
                });
        }
    }, [formValues.district_id]);
    useEffect(() => {
        if (isOpenEdit && addressId) {
            GET_ID_ADDRESS(`users/addresses/${addressId}?email=${encodeURIComponent(userEmail)}`)
                .then(response => {
                    setFormValues({
                        address_detail: response.addressDetail,
                        province_id: "",
                        district_id: "",
                        ward_id: "",
                        name: response.name,
                        phone: response.phone,
                    });
                    const province = provinces.find(p => p.ProvinceName === response.province);
                    const district = districts.find(d => d.DistrictName === response.district);
                    const ward = wards.find(w => w.WardName === response.ward);
                    setFormValues(prev => ({
                        ...prev,
                        province_id: province?.ProvinceID || "",
                        district_id: district?.DistrictID || "",
                        ward_id: ward?.WardCode || "",
                    }));
                    const fullAddress = `${response.ward}, ${response.district}, ${response.province}`;
                    setCurrentAddress(fullAddress);
                    const apiKey = process.env.REACT_APP_API_KEY_OPEN_CAGE_DATA;
                    axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`
                    )
                        .then(res => {
                            const { lat, lng } = res.data.results[0].geometry;
                            setCoords({ lat, lng });
                        })
                        .catch(error => {
                            console.error("Lỗi khi gọi OpenCage API:", error);
                        });
                })
                .catch(error => {
                    console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
                });
        }
    }, [isOpenEdit, addressId, userEmail, provinces, districts, wards]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.phone) {
            toast.error("Vui lòng nhập đầy đủ thông tin họ tên và số điện thoại");
            return;
        }
        setLoading(true);
        const addressData = {};
        if (formValues.name) addressData.name = formValues.name;
        if (formValues.phone) addressData.phone = formValues.phone;
        if (formValues.province_id) {
            const province = provinces.find(p => p.ProvinceID === formValues.province_id)?.ProvinceName;
            addressData.province = province || "";
        }
        if (formValues.district_id) {
            const district = districts.find(d => d.DistrictID === formValues.district_id)?.DistrictName;
            addressData.district = district || "";
        }
        if (formValues.ward_id) {
            const ward = wards.find(w => w.WardCode === formValues.ward_id)?.WardName;
            addressData.ward = ward || "";
        }
        if (formValues.address_detail) addressData.addressDetail = formValues.address_detail;

        PUT_EDIT(`users/addresses/${addressId}?email=${encodeURIComponent(userEmail)}`, addressData)
            .then(response => {
                setLoading(false);
                setIsOpenEdit(false);
                toast.success("Sửa địa chỉ thành công");
                setIsRefresh((prev) => !prev);
            })
            .catch(error => {
                setLoading(false);
                toast.error("Lỗi khi sửa địa chỉ");
                console.error("Failed to edit address:", error);
            });
    };

    return (
        <>
            <Modal show={isOpenEdit} onHide={() => setIsOpenEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa địa chỉ nhận hàng</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Modal.Title>Thông tin</Modal.Title>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và Tên</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Phạm Trần Xuân Tân"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="123-456-789"
                                name="phone"
                                value={formValues.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Body>
                        <Modal.Title>Địa chỉ</Modal.Title>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ hiện tại</Form.Label>
                            <p>{currentAddress || "Chưa có địa chỉ"}</p>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Tỉnh / Thành Phố</Form.Label>
                            <Form.Select
                                name="province_id"
                                value={formValues.province_id}
                                onChange={handleChange}
                            >
                                <option value="">Chọn Tỉnh</option>
                                {provinces.map((province) => (
                                    <option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Huyện</Form.Label>
                            <Form.Select
                                name="district_id"
                                value={formValues.district_id}
                                onChange={handleChange}
                            >
                                <option value="">Chọn huyện</option>
                                {districts.map((district) => (
                                    <option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Xã/Phường</Form.Label>
                            <Form.Select
                                name="ward_id"
                                value={formValues.ward_id}
                                onChange={handleChange}
                            >
                                <option value="">Chọn xã/phường</option>
                                {wards.map((ward) => (
                                    <option key={ward.WardCode} value={ward.WardCode}>
                                        {ward.WardName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="123 Main St"
                                name="address_detail"
                                value={formValues.address_detail}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Body>
                        <Modal.Title>Vị trí bản đồ</Modal.Title>
                        <Form.Group className="mb-3">
                            <MapAddress coords={coords} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsOpenEdit(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <ClipLoader color="#fff" size={20} />
                            ) : (
                                "Sửa"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EditAddress;
