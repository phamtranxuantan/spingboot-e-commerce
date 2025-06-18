import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/images/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { GET_ALL } from '../api/apiService';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector và useDispatch từ react-redux
import { FaUser } from 'react-icons/fa'; // Import FaUser from react-icons/fa
import { setCart } from '../redux/actions/cartActions'; // Import action setCart

const Header = () => {
    const { userEmail, setUserEmail } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Sử dụng useDispatch để dispatch action
    const cartProducts = useSelector(state => state.cart.products); // Lấy danh sách sản phẩm trong giỏ hàng từ Redux store

    const fetchCategories = () => {
        const params = {
            pageNumber: 0,
            pageSize: 5,
            sortBy: 'categoryId',
            sortOrder: 'asc',
        };
        GET_ALL('categories', params)
            .then(response => {
                setCategories(response.content);
                console.log("response:", response.content);
            })
            .catch(error => {
                console.error('Failed to fetch categories:', error);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const storedUserEmail = localStorage.getItem("userEmail");
        if (storedUserEmail) {
            setUserEmail(storedUserEmail);
        }
    }, [setUserEmail]);

    useEffect(() => {
        if (userEmail) {
            fetchCategories(); // Fetch categories again when user logs in
        }
    }, [userEmail]);

    useEffect(() => {
        const storedCartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
        dispatch(setCart(storedCartProducts)); // Dispatch action setCart để cập nhật giỏ hàng từ localStorage
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.clear(); // Xóa tất cả các mục trong localStorage
        setUserEmail(null);
        setCategories([]); // Clear categories on logout
        window.location.href = "/Login";
    };

    const handleSearch = (e) => {
        if(!searchKeyword){
            toast.warning('Vui lòng nhập từ khóa tìm kiếm!');
            return;
        }
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/ListingGrid?keyword=${searchKeyword}`);
        }
    };

    return (
        <header className="section-header">
            <nav className="navbar navbar-expand-md navbar-light border-bottom">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTop4" aria-controls="navbarTop4" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTop4">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                            <span className="nav-link">
                                {userEmail ? (
                                    <Link to="/IndexAccountProfile" className="nav-link">
                                       Xin chào: {userEmail}
                                    </Link>
                                  
                                ) : (
                                    <Link to="/Login">
                                    <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                                    </Link>
                                )}
                                </span>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/Cart" id="cart-icon" className="nav-link" style={{ position: 'relative' }}>
                                    <span id="cart-item-count" style={{position: 'absolute',top: '5px',right: '-5px',width: '15px',height: '15px',backgroundColor: '#ff5722',color: '#fff',textAlign: 'center',lineHeight: '15px',borderRadius: '50%',fontSize: '10px',fontWeight: 'bold',zIndex: 10 }}>
                                        {cartProducts.length}
                                    </span>
                                    <i className="fa fa-shopping-cart" style={{fontSize: '15px',color: '#333',transition: 'color 0.3s ease',cursor: 'pointer'}}></i>
                                </Link>
                            </li>
                            {userEmail && (
                                <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Đăng xuất</button></li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container">
                <section className="header-main border-bottom">
                    <div className="row row-sm">
                        <div className="col-6 col-sm col-md col-lg flex-grow-0">
                            <Link to="/" className="brand-wrap">
                                <img className="logo" src={logo} alt="logo" />
                            </Link>
                        </div>
                        <div className="col-6 col-sm col-md col-lg flex-md-grow-0">
                            <div className="d-md-none float-end">
                                <a href="#" className="btn btn-light"> <i className="fa fa-bell"></i> </a>
                                <a href="#" className="btn btn-light"> <i className="fa fa-user"></i> </a>
                                <a href="#" className="btn btn-light"> <i className="fa fa-shopping-cart"></i> 2 </a>
                            </div>
                            <div className="category-wrap d-none dropdown d-md-inline-block">
                                <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown"> Mua sắm theo </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {categories.length > 0 && categories.map((row) => (
                                        <li key={row.categoryId}><Link className="dropdown-item" to={`/ListingGrid?categoryId=${row.categoryId}`}>{row.categoryName}</Link></li>
                                    ))}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link className="dropdown-item" to="/ListingGrid">Xem tất cả</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl col-md-5 col-sm-12 flex-grow-1">
                            <form action="#" className="search-header" onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Tìm kiếm" 
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="col col-lg col-md flex-grow-0">
                            <button className="btn btn-block btn-primary" type="submit" onClick={handleSearch}> Lọc </button>
                        </div>
                    </div>
                </section>

                <nav className="navbar navbar-main navbar-expand pl-0">
                    <ul className="navbar-nav flex-wrap">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a 
                                className="nav-link dropdown-toggle" 
                                id="navbarDropdown" 
                                role="button" 
                                aria-haspopup="true" 
                                aria-expanded="false" 
                                data-bs-toggle="dropdown"
                                href="#"
                            >
                                Danh sách sản phẩm
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {categories.length > 0 ? (
                                    categories.map((row) => (
                                        <li key={row.categoryId}>
                                            <Link className="dropdown-item" to={`/ListingGrid?categoryId=${row.categoryId}`}>{row.categoryName}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li>
                                        <span className="dropdown-item text-muted">Không có sản phẩm</span>
                                    </li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item" to="/ListingGrid">Xem tất cả</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;