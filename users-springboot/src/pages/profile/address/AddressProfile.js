import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DELETE_ID, GET_ALL, PUT_EDIT } from "../../../api/apiService";
import { CreateAddress } from "./CreateAddress";
import { EditAddress } from "./EditAddress";
import Swal from "sweetalert2";
const AddressProfile = () => {   
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null); // Thêm state để lưu addressId

    const userEmail = localStorage.getItem("userEmail"); 

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await GET_ALL(`users/addresses?email=${encodeURIComponent(userEmail)}`);
                setAddresses(response);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, [isRefresh, userEmail]);

    const handleSetDefault = async (addressId) => {
        try {
            await PUT_EDIT(`users/addresses/${addressId}/default?email=${encodeURIComponent(userEmail)}`);
            toast.success("Đặt địa chỉ mặc định thành công");
            setIsRefresh((prev) => !prev);
        } catch (error) {
            toast.error("Lỗi khi đặt địa chỉ mặc định");
            console.error("Failed to set default address:", error);
        }
    };

    const handleDelete = async (addressId) => {
        try {
            await DELETE_ID(`users/addresses/${addressId}?email=${encodeURIComponent(userEmail)}`);
            toast.success("Xóa địa chỉ thành công");
            Swal.fire("Thành công!", "Xóa địa chỉ thành công.", "success");
            setIsRefresh((prev) => !prev);
        } catch (error) {
            toast.error("Lỗi khi xóa địa chỉ");
            console.error("Failed to delete address:", error);
        }
    };

    const handleEditClick = (addressId) => {
        setSelectedAddressId(addressId); // Lưu addressId vào state
        setIsOpenEdit(true);
    };

    return( 
        <div className="container-fluid px-3"> 
            <div className="row">
                <main className="col-12"> 
                    <button 
                        className="btn btn-light mb-3" 
                        onClick={() => setIsOpen(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm địa chỉ mới
                    </button>
                    <CreateAddress
                        setIsRefresh={setIsRefresh}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    ></CreateAddress>
                    <div className="row">
                        {addresses.map((address) => (
                            <div className="col-md-6" key={address.addressId}>
                                <article className="border rounded p-3 mb-4 shadow-sm">
                                    <h6>{address.province}, {address.district},{address.ward}</h6>
                                    <p>{address.addressDetail}</p>
                                    {address.default ? (
                                        <a className="btn btn-light disabled">
                                            <i className="fa fa-check"></i> Mặc định
                                        </a>
                                    ) : (
                                        <a className="btn btn-light" onClick={() => handleSetDefault(address.addressId)}>
                                            <i className="fa fa-check"></i> Đặt làm mặc định
                                        </a>
                                    )}
                                    <a className="btn btn-light" onClick={() => handleEditClick(address.addressId)}>
                                        <i className="fa fa-pen"></i>
                                    </a>
                                    <EditAddress 
                                        setIsRefresh={setIsRefresh}
                                        isOpenEdit={isOpenEdit}
                                        setIsOpenEdit={setIsOpenEdit}
                                        addressId={selectedAddressId} // Truyền addressId vào EditAddress
                                    ></EditAddress>
                                    <a className="btn btn-light" onClick={() => handleDelete(address.addressId)}>
                                        <i className="text-danger fa fa-trash"></i>
                                    </a>
                                </article>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AddressProfile;