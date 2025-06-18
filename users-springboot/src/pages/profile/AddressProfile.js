import React, { useState } from "react";
import { EditAddress } from "./EditAddress"; 
import { ModalAddress } from "./ModalAddress";

const AddressProfile = () => {   
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);

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
                    <ModalAddress
                        setIsRefresh={setIsRefresh}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    ></ModalAddress>
                    <div className="row">
                        <div className="col-md-6">
                            <article className="border rounded p-3 mb-4 shadow-sm">
                                <h6>London, United Kingdom</h6>
                                <p>Building: Nestone <br /> Floor: 22, Aprt: 12</p>
                                <a href="#" className="btn btn-light disabled">
                                    <i className="fa fa-check"></i> Mặc định
                                </a>
                                <a 
                                    href="#" 
                                    className="btn btn-light"
                                    onClick={() => setIsOpenEdit(true)}
                                >
                                    <i className="fa fa-pen"></i>
                                </a>
                                <a href="#" className="btn btn-light">
                                    <i className="text-danger fa fa-trash"></i>
                                </a>
                                <EditAddress 
                                    setIsRefresh={setIsRefresh}
                                    isOpenEdit={isOpenEdit}
                                    setIsOpenEdit={setIsOpenEdit}
                                ></EditAddress>
                            </article>
                        </div>
                        <div className="col-md-6">
                            <article className="border rounded p-3 mb-4 shadow-sm">
                                <h6>Tashkent, Uzbekistan</h6>
                                <p>Building one <br /> Floor: 2, Aprt: 32</p>
                                <a href="#" className="btn btn-light">Chọn làm mặc định</a>
                                <a href="#" className="btn btn-light">
                                    <i className="fa fa-pen"></i>
                                </a>
                                <a href="#" className="btn btn-light">
                                    <i className="text-danger fa fa-trash"></i>
                                </a>
                            </article>
                        </div>
                        <div className="col-md-6">
                            <article className="border rounded p-3 mb-4 shadow-sm">
                                <h6>Moscow, Russia</h6>
                                <p>Lenin street <br /> Building A, Floor: 3, Aprt: 32</p>
                                <a href="#" className="btn btn-light">Chọn làm mặc định</a>
                                <a href="#" className="btn btn-light">
                                    <i className="fa fa-pen"></i>
                                </a>
                                <a href="#" className="btn btn-light">
                                    <i className="text-danger fa fa-trash"></i>
                                </a>
                            </article>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AddressProfile;