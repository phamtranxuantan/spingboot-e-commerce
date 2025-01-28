import React, { useState, useEffect } from "react";
import { GET_ALL, GET_ID } from "../../api/apiService";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SectionContent = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1;
    const categoryId = queryParams.get("categoryId");
    const keyword = queryParams.get("keyword");
    const numItems = 5;

    const handlePageChange = (page) => {
        if (categoryId) {
            navigate(`/ListingGrid?page=${page}&categoryId=${categoryId}`);
        } else if (keyword) {
            navigate(`/ListingGrid?page=${page}&keyword=${keyword}`);
        } else {
            navigate(`/ListingGrid?page=${page}`);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                    <Link
                        className="page-link"
                        to={`?page=${i}${categoryId ? `&categoryId=${categoryId}` : ""}${keyword ? `&keyword=${keyword}` : ""}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Link>
                </li>
            );
        }
        return pageNumbers;
    };

    const handlePriceFilter = () => {
        if (minPrice && maxPrice) {
            navigate(`/ListingGrid?page=1&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        }
    };

    useEffect(() => {
        setLoading(true);
        const params = {
            pageNumber: currentPage,
            pageSize: numItems,
            sortBy: "productId",
            sortOrder: "asc",
        };
        if (categoryId) {
            GET_ALL(`categories/${categoryId}/products`, params)
                .then((response) => {
                    setProducts(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Không thể lấy sản phẩm:", error);
                    setLoading(false);
                });
            GET_ID("categories", categoryId)
                .then((item) => setCategory(item))
                .catch((error) => {
                    console.error("Không thể lấy danh mục:", error);
                });
        } else if (keyword) {
            GET_ALL(`products/keyword/${keyword}`, params)
                .then((response) => {
                    setProducts(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Không thể lấy sản phẩm:", error);
                    setLoading(false);
                });
            setCategory({ categoryName: `Kết quả tìm kiếm cho "${keyword}"` });
        } else if (minPrice && maxPrice) {
            GET_ALL(`products/KeywordPriceRange/minPrice/${minPrice}/maxPrice/${maxPrice}`, params)
                .then((response) => {
                    setProducts(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Không thể lấy sản phẩm:", error);
                    setLoading(false);
                });
            setCategory({ categoryName: `Kết quả tìm kiếm cho giá từ ${minPrice} đến ${maxPrice}` });
        } else {
            GET_ALL("products", params)
                .then((response) => {
                    setProducts(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Không thể lấy sản phẩm:", error);
                    setLoading(false);
                });
            setCategory({ categoryName: "Tất cả sản phẩm" });
        }
    }, [categoryId, keyword, minPrice, maxPrice, currentPage]);

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">Bạn đang ở đây:</div>
                            <nav className="col-md-8">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><a href="#">{category?.categoryName}</a>
                                    </li>
                                    {/* <li className="breadcrumb-item"><a href="#">Danh mục con</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Sản phẩm</li> */}
                                </ol>
                            </nav>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-2">Lọc theo</div>
                            <div className="col-md-10">
                                <ul className="list-inline">
                                    <li className="list-inline-item mr-3">
                                        <div className="form-inline">
                                            <label className="mr-2">Giá</label>
                                            <input className="form-control form-control-sm" placeholder="Tối thiểu" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                                            <span className="px-2"> - </span>
                                            <input className="form-control form-control-sm" placeholder="Tối đa" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                            <button type="button" className="btn btn-sm btn-light ml-2" onClick={handlePriceFilter}>Ok</button>
                                        </div>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <header className="mb-3">
                    <div className="form-inline">
                        <strong className="mr-md-auto">Kết quả tìm kiếm: </strong>
                        <select className="mr-2 form-control">
                            <option>Sản phẩm mới nhất</option>
                            <option>Xu hướng</option>
                            <option>Phổ biến nhất</option>
                            <option>Rẻ nhất</option>
                        </select>
                        <div className="btn-group">
                            <a href="page-listing-grid.html" className="btn btn-light active" data-bs-toggle="tooltip" title="Xem danh sách">
                                <i className="fa fa-bars"></i>
                            </a>
                            <a href="page-listing-large.html" className="btn btn-light" data-bs-toggle="tooltip" title="Xem lưới">
                                <i className="fa fa-th"></i>
                            </a>
                        </div>
                    </div>
                </header>

                <div className="row">
                    { !loading && products.length > 0 &&
                    products.map((product) => (
                        <div className="col-md-3" key={product.productId}>
                            <figure className="card card-product-grid">
                                <Link to={`/Detail/${product.productId}`} className="img-wrap">
                                    <span className="badge bg-danger">MỚI</span>
                                    <img src={`http://localhost:8080/api/public/products/image/${product.image}`} alt={product.productName} />
                                </Link>
                                <figcaption className="info-wrap">
                                    <a href="#" className="title mb-2">{product.productName}</a>
                                    <div className="price-wrap">
                                        <span className="price">${product.specialPrice}</span>
                                        <small className="text-muted">/mỗi sản phẩm</small>
                                    </div>
                                    <p className="mb-2">{product.quantity} Cái {" "} <small className="text-muted">(Số lượng tối thiểu)</small></p>
                                    <p className="text-muted">{product.categoryName}</p>
                                    <hr />
                                    <p className="mb-3">
                                        <span className="tag"><i className="fa fa-check"></i> Đã xác minh</span>
                                        
                                    </p>
                                    <label className="custom-control mb-3 custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" />
                                        <div className="custom-control-label">Thêm vào so sánh</div>
                                    </label>
                                    <a href="#" className="btn btn-outline-primary"><i className="fa fa-envelope"></i> Liên hệ nhà cung cấp</a>
                                </figcaption>
                            </figure>
                        </div>
                    ))}
                    {loading && <p>Đang tải...</p>}
                    {!loading && products.length === 0 && <p>Sản phẩm không có trong cửa hàng</p>}
                </div>

                <nav className="mb-4" aria-label="Page navigation sample">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={handlePrevious}>Trang Trước</button>
                        </li>
                        {renderPageNumbers()}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={handleNext}>Trang Sau</button>
                        </li>
                    </ul>
                </nav>

                <div className="box text-center">
                    <p>Bạn có tìm thấy những gì bạn đang tìm kiếm không?</p>
                    <a href="#" className="btn btn-light">Có</a>
                    <a href="#" className="btn btn-light">Không</a>
                </div>
            </div>
        </section>
    );
};

export default SectionContent;