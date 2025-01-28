import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_ID, POST_ADD, GET_ALL } from "../../api/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux'; // Import useDispatch từ react-redux
import { addToCart } from '../../redux/actions/cartActions'; // Import action addToCart

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartId, setCartId] = useState(localStorage.getItem('cartId')); // Lấy cartId từ localStorage
    const userEmail = localStorage.getItem("userEmail"); // Lấy email người dùng từ localStorage
    const dispatch = useDispatch(); // Sử dụng useDispatch để dispatch action

    useEffect(() => {
        const fetchCartId = async () => {
            if (!cartId && userEmail) {
                try {
                    const response = await GET_ALL(`users/email/${encodeURIComponent(userEmail)}`);
                    if (response && response.cart && response.cart.cartId) {
                        const newCartId = response.cart.cartId;
                        setCartId(newCartId);
                        localStorage.setItem("cartId", newCartId); // Lưu cartId vào localStorage
                    } else {
                        console.error("Cart ID not found in user data.");
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };

        fetchCartId();
    }, [userEmail, cartId]);

    useEffect(() => {
        GET_ID(`products`, productId)
            .then(response => {
                setProduct(response);
            })
            .catch(error => {
                console.error('Failed to fetch product details:', error);
            });
    }, [productId]);

    const handleAddToCart = () => {
        if (!cartId) {
            toast.error('Không thể lấy ID giỏ hàng!');
            return;
        }
        POST_ADD(`carts/${cartId}/products/${productId}/quantity/${quantity}`)
            .then(response => {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
                // Dispatch action thêm sản phẩm vào giỏ hàng
                dispatch(addToCart({ productId, quantity }));
            })
            .catch(error => {
                if (error.response && error.response.status === 400 && error.response.data.message.includes("already exists in the cart")) {
                    toast.warning('Sản phẩm đã có trong giỏ hàng!');
                } else {
                    toast.error('Lỗi khi thêm vào giỏ hàng!');
                }
                console.error('Failed to add product to cart:', error);
            });
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <section className="section-content bg-white padding-y">
            <div className="container">

                {/* ============================ CHI TIẾT SẢN PHẨM ======================== */}
                <div className="row">
                    <aside className="col-md-6">
                        <div className="card">
                            <article className="gallery-wrap"> 
                                <div className="img-big-wrap">
                                    <div> <a href="#"><img src={`http://localhost:8080/api/public/products/image/${product.image}`} alt="Sản phẩm" /></a></div>
                                </div> {/* slider-product.// */}
                                <div className="thumbs-wrap">
                                    <a href="#" className="item-thumb"> <img src={`http://localhost:8080/api/public/products/image/${product.image}`} alt="Sản phẩm" /></a>
                                    {/* Add more thumbnails if available */}
                                </div> {/* slider-nav.// */}
                            </article> {/* gallery-wrap .end// */}
                        </div> {/* card.// */}
                    </aside>
                    <main className="col-md-6">
                        <article className="product-info-aside">

                            <h2 className="title mt-3">{product.productName}</h2>

                            <div className="rating-wrap my-3">
                                <ul className="rating-stars">
                                    <li style={{ width: "80%" }} className="stars-active"> 
                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i> 
                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i> 
                                        <i className="fa fa-star"></i> 
                                    </li>
                                    <li>
                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i> 
                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i> 
                                        <i className="fa fa-star"></i> 
                                    </li>
                                </ul>
                                <small className="label-rating text-muted">132 đánh giá</small>
                                <small className="label-rating text-success"> <i className="fa fa-clipboard-check"></i> 154 đơn hàng </small>
                            </div> {/* rating-wrap.// */}

                            <div className="mb-3"> 
                                <var className="price h4">USD {product.price}</var> 
                                <span className="text-muted">USD {product.price * 1.21} bao gồm VAT</span> 
                            </div> {/* price-detail-wrap .// */}

                            <p>{product.description}</p>

                            <dl className="row">
                                <dt className="col-sm-3">Nhà sản xuất</dt>
                                <dd className="col-sm-9"><a href="#">Great textile Ltd.</a></dd>

                                <dt className="col-sm-3">Mã sản phẩm</dt>
                                <dd className="col-sm-9">{product.productId}</dd>

                                <dt className="col-sm-3">Bảo hành</dt>
                                <dd className="col-sm-9">2 năm</dd>

                                <dt className="col-sm-3">Thời gian giao hàng</dt>
                                <dd className="col-sm-9">3-4 ngày</dd>

                                <dt className="col-sm-3">Tình trạng</dt>
                                <dd className="col-sm-9">Còn hàng</dd>
                            </dl>

                            <div className="form-row mt-4">
                                <div className="form-group col-md flex-grow-0">
                                    <div className="input-group mb-3 input-spinner">
                                        <div className="input-group-prepend">
                                            <button className="btn btn-light" type="button" onClick={() => setQuantity(quantity + 1)}> + </button>
                                        </div>
                                        <input type="text" className="form-control" value={quantity} readOnly />
                                        <div className="input-group-append">
                                            <button className="btn btn-light" type="button" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}> &minus; </button>
                                        </div>
                                    </div>
                                </div> {/* col.// */}
                                <div className="form-group col-md">
                                    <button className="btn btn-primary" onClick={handleAddToCart}> 
                                        <i className="fas fa-shopping-cart"></i> <span className="text">Thêm vào giỏ hàng</span> 
                                    </button>
                                    <a href="#" className="btn btn-light">
                                        <i className="fas fa-envelope"></i> <span className="text">Liên hệ nhà cung cấp</span> 
                                    </a>
                                </div> {/* col.// */}
                            </div> {/* row.// */}

                        </article> {/* product-info-aside .// */}
                    </main> {/* col.// */}
                </div> {/* row.// */}

                {/* ================ CHI TIẾT SẢN PHẨM KẾT THÚC .// ================= */}

            </div> {/* container .//  */}
        </section>
    );
};

export default ProductDetail;