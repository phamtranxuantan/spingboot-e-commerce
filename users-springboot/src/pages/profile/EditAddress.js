import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"; // Dùng Bootstrap
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export const EditAddress = ({ isOpenEdit, setIsOpenEdit, setIsRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        address_detail: "",
        nation_id: "",
        province_id: "",
        first_name: "",
        last_name: "",
        phone: "",
    });

    const nations = [
        { id: 1, name: "Vietnam" },
        { id: 2, name: "USA" },
    ]; // Giả định dữ liệu
    const provinces = [
        { id: 1, name: "Hanoi" },
        { id: 2, name: "Ho Chi Minh City" },
    ]; // Giả định dữ liệu

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Giả lập kiểm tra rỗng
        if (
            !formValues.address_detail ||
            !formValues.nation_id ||
            !formValues.province_id ||
            !formValues.first_name ||
            !formValues.last_name ||
            !formValues.phone
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);
        // Giả lập API
        setTimeout(() => {
            setLoading(false);
            setIsOpenEdit(false);
            toast.success("Chỉnh sửa địa chỉ thành công");
            setIsRefresh((prev) => !prev);
        }, 1500);
    };

    return (
        <>
            <Modal show={isOpenEdit} onHide={() => setIsOpenEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa địa chỉ</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ đệm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Vũ Văn"
                                name="last_name"
                                value={formValues.last_name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="A"
                                name="first_name"
                                value={formValues.first_name}
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
                            <Form.Label>Quốc gia</Form.Label>
                            <Form.Select
                                name="nation_id"
                                value={formValues.nation_id}
                                onChange={handleChange}
                            >
                                <option value="">Chọn quốc gia</option>
                                {nations.map((nation) => (
                                    <option key={nation.id} value={nation.id}>
                                        {nation.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tỉnh / Thành phố</Form.Label>
                            <Form.Select
                                name="province_id"
                                value={formValues.province_id}
                                onChange={handleChange}
                            >
                                <option value="">Chọn tỉnh / thành phố</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
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

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsOpenEdit(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <ClipLoader color="#fff" size={20} />
                            ) : (
                                "Lưu"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EditAddress;
