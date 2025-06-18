import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Footer extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <footer className="section-footer bg-secondary">
                <div className="container">
                    <section className="footer-top padding-y-lg text-white">
                        <div className="row">
                           <h1 className="aaa text-center"> Chào mừng đến với Alistyle Shop</h1>
                  
                            {/* <aside className="col-md col-6">
                                <h6 className="title">Thương hiệu</h6>
                                <ul className="list-unstyled">
                                    <li> <a href="#">Adidas</a></li>
                                    <li> <a href="#">Puma</a></li>
                                    <li> <a href="#">Reebok</a></li>
                                    <li> <a href="#">Nike</a></li>
                                </ul>
                            </aside>
                            <aside className="col-md col-6">
                                <h6 className="title">Công ty</h6>
                                <ul className="list-unstyled">
                                    <li> <a href="#">Về chúng tôi</a></li>
                                    <li> <a href="#">Tuyển dụng</a></li>
                                    <li> <a href="#">Tìm cửa hàng</a></li>
                                    <li> <a href="#">Quy định và điều khoản</a></li>
                                    <li> <a href="#">Sơ đồ trang</a></li>
                                </ul>
                            </aside>
                            <aside className="col-md col-6">
                                <h6 className="title">Hỗ trợ</h6>
                                <ul className="list-unstyled">
                                    <li> <a href="#">Liên hệ</a></li>
                                    <li> <a href="#">Hoàn tiền</a></li>
                                    <li> <a href="#">Trạng thái đơn hàng</a></li>
                                    <li> <a href="#">Thông tin giao hàng</a></li>
                                    <li> <a href="#">Khiếu nại</a></li>
                                </ul>
                            </aside>
                            <aside className="col-md col-6">
                                <h6 className="title">Tài khoản</h6>
                                <ul className="list-unstyled">
                                    <li> <a href="#"> Đăng nhập </a></li>
                                    <li> <a href="#"> Đăng ký </a></li>
                                    <li> <a href="#"> Cài đặt tài khoản </a></li>
                                    <li> <a href="#"> Đơn hàng của tôi </a></li>
                                </ul>
                            </aside>
                            <aside className="col-md">
                                <h6 className="title">Mạng xã hội</h6>
                                <ul className="list-unstyled">
                                    <li><a href="#"> <i className="fab fa-facebook"></i> Facebook </a></li>
                                    <li><a href="#"> <i className="fab fa-twitter"></i> Twitter </a></li>
                                    <li><a href="#"> <i className="fab fa-instagram"></i> Instagram </a></li>
                                    <li><a href="#"> <i className="fab fa-youtube"></i> Youtube </a></li>
                                </ul>
                            </aside> */}
                        </div>
                    </section>

                    <section className="footer-bottom text-center">
                        <p className="text-white">Chính sách bảo mật - Điều khoản sử dụng - Hướng dẫn pháp lý thông tin người dùng</p>
                        <p className="text-muted"> &copy 2019 Tên công ty, Bảo lưu mọi quyền </p>
                        <br />
                    </section>
                </div>
            </footer>

        );
    }
}
export default Footer