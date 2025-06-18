import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import { DELETE_ID, GET_ALL, PUT_EDIT } from "../../api/apiService";
import { fetchCartData, removeFromCart, updateCartQuantity } from "../../redux/actions/cartActions"; // Import Redux actions

const SectionContent = () => {
    const dispatch = useDispatch(); // Initialize dispatch
    const cart = useSelector(state => state.cart); // Get cart state from Redux
    const [products, setProducts] = useState([]);
    const userEmail = localStorage.getItem("userEmail");
    let cartId = localStorage.getItem("cartId");
    const navigate = useNavigate();
    console.log(`Fetching cart for user: ${userEmail} with cartId: ${cartId}`);

    useEffect(() => {
        const fetchCartId = async () => {
            if (!cartId && userEmail) {
                try {
                    const response = await GET_ALL(`users/email/${encodeURIComponent(userEmail)}`);
                    if (response && response.cart && response.cart.cartId) {
                        cartId = response.cart.cartId;
                        localStorage.setItem("cartId", cartId);
                        dispatch(fetchCartData(userEmail, cartId)); // Dispatch fetchCartData action
                    } else {
                        console.error("Cart ID not found in user data.");
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.error("Unauthorized access - please log in.");
                        navigate('/login'); // Redirect to login page
                    } else {
                        console.error("Failed to fetch user data:", error);
                    }
                }
            } else if (cartId) {
                dispatch(fetchCartData(userEmail, cartId)); // Dispatch fetchCartData action
            } else {
                console.log('User email or cart ID is missing.');
            }
        };

        fetchCartId();
    }, [userEmail, cartId, dispatch, navigate]);

    const handleRemoveProduct = async (productId) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await DELETE_ID(`carts/${cartId}/product/${productId}`);
                    dispatch(removeFromCart(productId)); // Dispatch removeFromCart action
                    toast.success("Sản phẩm đã được xóa!");
                } catch (error) {
                    console.error("Failed to remove product from cart:", error);
                    toast.error("Không thể xóa sản phẩm !");
                }
            }
        });
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        const productDetail = products.find(p => p.productId === productId);
        if (productDetail && newQuantity > productDetail.quantity) {
            toast.error("Sản phẩm đã đạt tới giới hạn trong kho!");
            return;
        }

        try {
            await PUT_EDIT(`carts/${cartId}/products/${productId}/quantity/${newQuantity}`);
            dispatch(updateCartQuantity(productId, newQuantity)); // Dispatch updateCartQuantity action
            toast.success("Số lượng sản phẩm đã được cập nhật!");
        } catch (error) {
            console.error("Failed to update product quantity:", error);
            toast.error("Không thể cập nhật số lượng sản phẩm!");
        }
    };

    const handleCheckout = () => {
        console.log("dữ liệu tổng tiên trước khi chuyển qua checkout: ", cart.totalPrice);
        console.log("dữ liệu cartId: ", cartId);
        if (!cart || !cart.totalPrice || !cartId) {
            console.error("Thông tin giỏ hàng không đầy đủ để thực hiện thanh toán.");
            return;
        }
    
        navigate('/Order', {
            state: {
                totalPrice: cart.totalPrice,
                cartId: cartId,
            },
        });
    };

    if (!userEmail) {
        return <div>User email is missing.</div>;
    }

    if (!cartId && !cart) {
        return <div>Cart ID is missing.</div>;
    }

    if (!cart) {
        return <div>Loading...</div>;
    }

    return (
        <section className="section-content padding-y">
            <div className="container">
                <div className="row">
                    <main className="col-md-9">
                        <div className="card">
                            {cart.products.length === 0 ? (
                                <div className="alert alert-warning">Giỏ hàng của bạn trống</div>
                            ) : (
                                <table className="table table-borderless table-shopping-cart">
                                    <thead className="text-muted">
                                        <tr className="small text-uppercase">
                                            <th scope="col">Sản phẩm</th>
                                            <th scope="col" width="120">Số lượng</th>
                                            <th scope="col" width="120">Giá</th>
                                            <th scope="col" className="text-right" width="200"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.products.map(product => {
                                            const productDetail = products.find(p => p.productId === product.productId);
                                            const imageUrl = product.imageProduct ? ` ${product.imageProduct}` : 'default-image-url.jpg';
                                            return (
                                                <tr key={product.productId}>
                                                    <td>
                                                        <figure className="itemside">
                                                            <div className="aside"><img src={imageUrl} className="img-sm" alt="product"/></div>
                                                            <figcaption className="info">
                                                                <a href="#" className="title text-dark">{product.productName}</a>
                                                                <p className="text-muted small"> Danh mục: {product.categoryName}</p>
                                                            </figcaption>
                                                        </figure>
                                                    </td>
                                                    <td>
                                                        <div className="input-group mb-3 input-spinner" style={{ maxWidth: "100px" }}>
                                                            <div className="input-group-prepend">
                                                                <button className="btn btn-light btn-sm" type="button" style={{ maxWidth: "20px" }} onClick={() => handleQuantityChange(product.productId, product.quantity + 1)}> + </button>
                                                            </div>
                                                            <input type="text" className="form-control text-center" style={{ maxWidth: "33px", fontSize: "10px" }} value={product.quantity} readOnly />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-light btn-sm" type="button" style={{ maxWidth: "20px" }} onClick={() => handleQuantityChange(product.productId, product.quantity > 1 ? product.quantity - 1 : 1)} disabled={product.quantity <= 1}> &minus; </button>
                                                            </div>
                                                            {/* {productDetail && <small className="text-muted">{productDetail.quantity} Cái {" "} <small className="text-muted">(Số lượng tối đa)</small></small>} */}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price-wrap">
                                                            <var className="price">{product.specialPrice}đ/Cái</var>
                                                            {/* <small className="text-muted">{product.specialPrice} đ <br/> mỗi cái </small> */}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <button className="btn btn-light" onClick={() => handleRemoveProduct(product.productId)}> Xóa</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            <div className="card-body border-top">
                                <button onClick={handleCheckout} className="btn btn-primary float-md-right"> Mua hàng <i className="fa fa-chevron-right"></i> </button>
                                <Link to="/" className="btn btn-light"> <i className="fa fa-chevron-left"></i> Tiếp tục mua sắm </Link>
                            </div>
                        </div>
                        <div className="alert alert-success mt-3">
                            <p className="icontext"><i className="icon text-success fa fa-truck"></i> Giao hàng miễn phí trong 1-2 tuần</p>
                        </div>
                    </main>
                    <aside className="col-md-3">
                        
                        <div className="card">
                            <div className="card-body">
                                {cart.totalPrice !== undefined && (
                                    <>
                                        <dl className="dlist-align">
                                            <dt>Tổng giá:</dt>
                                            <dd className="text-right">{cart.totalPrice} đ</dd>
                                        </dl>
                                        <dl className="dlist-align">
                                            <dt>Giảm giá:</dt>
                                            <dd className="text-right">0 đ</dd>
                                        </dl>
                                        <dl className="dlist-align">
                                            <dt>Tổng cộng:</dt>
                                            <dd className="text-right h5"><strong>{cart.totalPrice} đ</strong></dd>
                                        </dl>
                                        <hr />
                                        <p className="text-center mb-3">
                                            <img src={require('../../assets/images/misc/payments.png')} height="26" alt="payments"/>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default SectionContent;