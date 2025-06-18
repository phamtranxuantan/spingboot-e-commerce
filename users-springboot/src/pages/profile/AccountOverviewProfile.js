import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { GET_ALL } from "../../api/apiService"; // Import GET_ALL từ apiService

const AccountOverview = () => {
    const [user, setUser] = useState({});
    const [defaultAddress, setDefaultAddress] = useState(null); // Thêm state cho địa chỉ mặc định
    const userEmail = localStorage.getItem("userEmail"); // Lấy email từ localStorage

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await GET_ALL(`users/email/${encodeURIComponent(userEmail)}`);
                setUser(response);
                console.log('User data:', response);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchDefaultAddress = async () => {
            try {
                const response = await GET_ALL(`users/addresses/default?email=${encodeURIComponent(userEmail)}`);
                setDefaultAddress(response);
                console.log('Default address:', response);
            } catch (error) {
                console.error('Error fetching default address:', error);
            }
        };

        fetchUserData();
        fetchDefaultAddress();
    }, [userEmail]);

    return(
        <div className="container-fluid px-4">
            <div className="row">
                <main className="col-12">
                <article className="card mb-3">
                    <div className="card-body">
                    <figure className="icontext d-flex align-items-center">
                        <div className="icon mr-3">
                        <img className="rounded-circle img-sm border" src={`http://localhost:8080/api/public/users/imageUser/${user.imageUser}`} alt="Avatar" />
                        </div>
                        <div className="text">
                        <strong> {user.lastName}{user.firstName}</strong> <br />
                        <p className="mb-2">{user.email}</p>
                        <Link to="/IndexAccountProfile/SettingProfile" className="btn btn-light btn-sm">Chỉnh sửa</Link>
                        </div>
                    </figure>
                    <hr />
                    <p>
                        <i className="fa fa-map-marker text-muted"></i> &nbsp; Địa chỉ: <br />
                        {defaultAddress ? (
                            <>
                                {defaultAddress.addressDetail}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.province} &nbsp;
                            </>
                        ) : (
                            "Loading address..."
                        )}
                        <Link to="/IndexAccountProfile/AddressProfile" className="btn-link">Chỉnh sửa</Link>
                    </p>

                    {/* <article className="card-group card-stat">
                        <figure className="card bg-light text-center">
                        <div className="p-3">
                            <h4 className="title">38</h4>
                            <span>Orders</span>
                        </div>
                        </figure>
                        <figure className="card bg-light text-center">
                        <div className="p-3">
                            <h4 className="title">5</h4>
                            <span>Wishlists</span>
                        </div>
                        </figure>
                        <figure className="card bg-light text-center">
                        <div className="p-3">
                            <h4 className="title">12</h4>
                            <span>Awaiting delivery</span>
                        </div>
                        </figure>
                        <figure className="card bg-light text-center">
                        <div className="p-3">
                            <h4 className="title">50</h4>
                            <span>Delivered items</span>
                        </div>
                        </figure>
                    </article> */}
                    </div>
                </article>

                {/* <article className="card mb-3">
                    <div className="card-body">
                    <h5 className="card-title mb-4">Recent orders</h5>

                    <div className="row">
                        <div className="col-md-6">
                        <figure className="itemside mb-3 d-flex align-items-center">
                            <div className="aside mr-3">
                            <img src="images/items/1.jpg" className="border img-sm" alt="Item 1" />
                            </div>
                            <figcaption className="info">
                            <time className="text-muted"><i className="fa fa-calendar-alt"></i> 12.09.2019</time>
                            <p>Great book name goes here</p>
                            <span className="text-success">Order confirmed</span>
                            </figcaption>
                        </figure>
                        </div>
                        <div className="col-md-6">
                        <figure className="itemside mb-3 d-flex align-items-center">
                            <div className="aside mr-3">
                            <img src="images/items/2.jpg" className="border img-sm" alt="Item 2" />
                            </div>
                            <figcaption className="info">
                            <time className="text-muted"><i className="fa fa-calendar-alt"></i> 12.09.2019</time>
                            <p>How to be rich</p>
                            <span className="text-success">Departured</span>
                            </figcaption>
                        </figure>
                        </div>
                        <div className="col-md-6">
                        <figure className="itemside mb-3 d-flex align-items-center">
                            <div className="aside mr-3">
                            <img src="images/items/3.jpg" className="border img-sm" alt="Item 3" />
                            </div>
                            <figcaption className="info">
                            <time className="text-muted"><i className="fa fa-calendar-alt"></i> 12.09.2019</time>
                            <p>Harry Potter book</p>
                            <span className="text-success">Shipped</span>
                            </figcaption>
                        </figure>
                        </div>
                    </div>

                    <a href="#" className="btn btn-outline-primary btn-block mt-3">See all orders <i className="fa fa-chevron-down"></i></a>
                    </div>
                </article> */}
                </main>
            </div>
            </div>

    )
}

export default AccountOverview;