import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const IndexAccountProfile = () => {   
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        // Xóa token hoặc thông tin đăng nhập khỏi localStorage/sessionStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('cartProducts');
        // Chuyển hướng về trang đăng nhập hoặc trang chủ
        navigate('/Login');
        // Reload lại trang để đảm bảo trạng thái đăng xuất
        window.location.reload();
    };

    return(
        <>
        <section className="section-pagetop bg-light py-3 mb-4 border-bottom">
            <div className="container">
                <h2 className="title-page h4">Tài khoản</h2>
            </div>
            </section>

            <section className="section-content py-4">
            <div className="container">
                <div className="row">
                <aside className="col-md-3 mb-4">
                    <nav className="list-group shadow-sm">
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/AccountOverview"
                    >
                        Thông tin tài khoản
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/AddressProfile"
                    >
                        Địa chỉ nhận hàng
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/OrderProfile"
                    >
                        Đơn hàng
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/SettingProfile"
                    >
                        Cài đặt
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/SupportProfile"
                    >
                        Hỗ trợ
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                        isActive ? "list-group-item active" : "list-group-item list-group-item-action"
                        }
                        to="/IndexAccountProfile/ChangePassword"
                    >
                        Đổi mật khẩu
                    </NavLink>

                    <a
                        href="#"
                        className="list-group-item list-group-item-action"
                        onClick={handleLogout}
                    >
                        Đăng xuẩt
                    </a>
                    </nav>
                </aside>

                <main className="col-md-9">
                    <Outlet />
                </main>
                </div>
            </div>
            </section>
        </>
    )
}

export default IndexAccountProfile;