import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"; // Dùng Bootstrap
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { GET_ALL, POST_ADD } from "../../../api/apiService";
import MapAddress from "../../../components/MapAddress";
const defaultProps = {
    center: {
      lat: 10.835460127679875,
      lng: 106.7822759639199
    },
    zoom: 11
  };

export const CreateAddress = ({ isOpen, setIsOpen, setIsRefresh }) => {
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

    
    const userEmail = localStorage.getItem("userEmail"); // Lấy email người dùng từ localStorage

    useEffect(() => {
        GET_ALL("ghn/provinces")
            .then(response => {
                setProvinces(response);
            })
            .catch(error => {
                toast.error("Không thể lấy danh sách tỉnh");
            });
    }, []);

    useEffect(() => {
        if (formValues.province_id) {
            // Lấy danh sách huyện khi chọn tỉnh
            GET_ALL(`ghn/districts?provinceId=${formValues.province_id}`)
                .then(response => {
                    setDistricts(response);
                    setWards([]); // Reset danh sách xã/phường khi thay đổi tỉnh
                })
                .catch(error => {
                    toast.error("Không thể lấy danh sách huyện");
                });
        }
    }, [formValues.province_id]);

    useEffect(() => {
        if (formValues.district_id) {
            // Lấy danh sách xã/phường khi chọn huyện
            GET_ALL(`ghn/wards?districtId=${formValues.district_id}`)
                .then(response => {
                    setWards(response);
                })
                .catch(error => {
                    toast.error("Không thể lấy danh sách xã/phường");
                });
        }
    }, [formValues.district_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    useEffect(() => {
        const updateMapLocation = async () => {
            if (  formValues.ward_id && formValues.district_id && formValues.province_id) {
                const province = provinces.find(p => p.ProvinceID === parseInt(formValues.province_id))?.ProvinceName;
                const district = districts.find(d => d.DistrictID === parseInt(formValues.district_id))?.DistrictName;
                const ward = wards.find(w => w.WardCode === formValues.ward_id)?.WardName;
                const fullAddress = `${province}, ${district}, ${ward}`;
                const apiKey = process.env.REACT_APP_API_KEY_OPEN_CAGE_DATA; // Lấy API key từ biến môi trường
                try {
                    const res = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${apiKey}`
                    );
                    const { lat, lng } = res.data.results[0].geometry;
                    setCoords({ lat, lng });
                } catch (error) {
                    console.error("Lỗi khi gọi OpenCage API:", error);
                }
            }
        };

        updateMapLocation();
    }, [ formValues.ward_id, formValues.district_id, formValues.province_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (
            //!formValues.address_detail ||
            !formValues.province_id ||
            !formValues.district_id ||
            !formValues.ward_id ||
            !formValues.name ||
            !formValues.phone
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);

        const province = provinces.find(p => p.ProvinceID === parseInt(formValues.province_id))?.ProvinceName;
        const district = districts.find(d => d.DistrictID === parseInt(formValues.district_id))?.DistrictName;
        const ward = wards.find(w => w.WardCode === formValues.ward_id)?.WardName;

        const addressData = {
            name: formValues.name,
            phone: formValues.phone,
            province: province || "",
            district: district || "",
            ward: ward || "",
            addressDetail: formValues.address_detail
        };

        POST_ADD(`users/addresses?email=${encodeURIComponent(userEmail)}`, addressData)
            .then(response => {
                setLoading(false);
                setIsOpen(false);
                toast.success("Thêm địa chỉ thành công");
                setIsRefresh((prev) => !prev);
            })
            .catch(error => {
                setLoading(false);
                toast.error("Lỗi khi thêm địa chỉ");
                console.error("Failed to add address:", error);
            });
    };

    return (
        <>
            <Modal show={isOpen} onHide={() => setIsOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm địa chỉ nhận hàng</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
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

                        <Form.Group className="mb-3">
                            <Form.Label>Bản đồ</Form.Label>
                            <MapAddress coords={coords} />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <ClipLoader color="#fff" size={20} />
                            ) : (
                                "Thêm"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default CreateAddress;
