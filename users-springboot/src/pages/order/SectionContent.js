import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { POST_ADD, GET_ALL,GET_ID } from "../../api/apiService"; // Import POST_ADD và GET_ID
import { toast } from "react-toastify"; // Import Toastify để thông báo
import "react-toastify/dist/ReactToastify.css";

const SectionContent = () => {
    const location = useLocation(); // Sử dụng useLocation để nhận state
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const { totalPrice, cartId } = location.state || { totalPrice: 0, cartId: null }; // Lấy dữ liệu từ state
    const userEmail = localStorage.getItem("userEmail"); // Lấy email người dùng từ localStorage
    const [paymentMethod, setPaymentMethod] = useState(""); // State để lưu phương thức thanh toán được chọn

    const [loading, setLoading] = useState(false); // State để xử lý trạng thái loading
    const [cartProducts, setCartProducts] = useState([]); // State để lưu thông tin sản phẩm trong giỏ hàng

    useEffect(() => {
        const fetchCartProducts = async () => {
            if (cartId && userEmail) {
                try {
                    const response = await GET_ID(`users/${encodeURIComponent(userEmail)}/carts`, cartId);
                    setCartProducts(response.products);
                } catch (error) {
                    console.error("Không thể lấy thông tin sản phẩm trong giỏ hàng:", error);
                }
            }
        };

        fetchCartProducts();
    }, [cartId, userEmail]);

    // Xử lý nút thanh toán
    const handleCheckout = async (event) => {
        event.preventDefault();
    
        if (!cartId || !userEmail) {
            toast.error("Vui lòng kiểm tra giỏ hàng và email người dùng!");
            return;
        }

        if (!paymentMethod) {
            toast.warning("Vui lòng chọn phương thức thanh toán!");
            return;
        }
    
        setLoading(true);
    
        try {
            // Gửi request POST đến API để tạo đơn hàng
            const response = await POST_ADD(
                `users/${userEmail}/carts/${cartId}/payments/${paymentMethod}/order`
            );
    
            if (response?.orderId && response?.totalAmount) {
                const { orderId } = response;
                const totalAmount = totalPrice || response.totalAmount; // Ưu tiên giá trị của totalPrice nếu có
    
                let paymentUrl;
                if (paymentMethod === "Payment-VNPay") {
                    // Gửi yêu cầu tạo URL thanh toán VNPay
                    paymentUrl = await createPaymentUrlVNPay(orderId, totalAmount);
                } else if (paymentMethod === "MoMo") {
                    // Gửi yêu cầu tạo URL thanh toán MoMo
                    paymentUrl = await createPaymentUrlMoMo(orderId, totalAmount);
                }
    
                if (paymentUrl) {
                    // Chuyển hướng tới trang thanh toán
                    window.location.href = paymentUrl;
                } else {
                    toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!");
                }
            } else {
                throw new Error("Phản hồi từ API không hợp lệ.");
            }
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại!");
        } finally {
            setLoading(false); // Đảm bảo trạng thái loading kết thúc dù thành công hay thất bại
        }
    };
    
    // Helper function to convert an object to a query string
    const objectToQueryString = (obj) => {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    };

    const createPaymentUrlVNPay = async (orderId, totalPrice) => {
        if (!orderId || !totalPrice) {
            toast.error("Thông tin không đầy đủ để tạo URL thanh toán.");
            return null;
        }
    
        try {
            const queryString = objectToQueryString({ orderId, totalPrice });
            const paymentResponse = await GET_ALL(`paymentVnpay?${queryString}`);
        
            // Kiểm tra chi tiết cấu trúc
            if (paymentResponse?.url) {
                return paymentResponse.url;
            } else {
                throw new Error("Không nhận được URL thanh toán từ VNPay.");
            }
        } catch (error) {
            toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!");
            return null;
        }
    };

    const createPaymentUrlMoMo = async (orderId, totalPrice) => {
        if (!orderId || !totalPrice) {
            toast.error("Thông tin không đầy đủ để tạo URL thanh toán.");
            return null;
        }
    
        try {
            const queryString = objectToQueryString({ orderId, totalPrice });
            console.log("giá trị queryString", queryString);
            const paymentResponse = await GET_ALL(`paymentMomo?${queryString}`);
        
            // Kiểm tra chi tiết cấu trúc
            if (paymentResponse?.url) {
                return paymentResponse.url;
            } else {
                throw new Error("Không nhận được URL thanh toán từ MoMo.");
            }
        } catch (error) {
            toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!");
            return null;
        }
    };

    // Hiển thị thông báo nếu không có giỏ hàng
    if (!cartId) {
        return <div>Bạn chưa có giỏ hàng</div>;
    }

    return (
        <>
            <section id="checkout-container">
                <div className="container">
                    <div className="py-5 text-center">
                        <i className="fa fa-credit-card fa-3x text-primary"></i>
                        <h2 className="my-3">Form thanh toán</h2>
                    </div>
                    <div className="row py-5">
                        <div className="col-md-4 order-md-2 mb-4">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Giỏ hàng</span>
                                <span className="badge badge-secondary badge-pill">{cartProducts.length}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {cartProducts.map((product) => (
                                    <li key={product.productId} className="list-group-item d-flex justify-content-between lh-condensed" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                                        <div className="d-flex align-items-center">
                                            <img src={`http://localhost:8080/api/public/products/image/${product.image}`} alt={product.productName} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            <div>
                                                <h6 className="my-0">{product.productName}</h6>
                                                <span className="text-muted">{product.price} đ</span>
                                            </div>
                                            <i className="text-muted">x {product.quantity}</i>
                                        </div>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Tổng cộng (vnđ)</span>
                                    <strong>{totalPrice}</strong>
                                </li>
                            </ul>
                            {/* <form className="card p-2">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Mã giảm giá" />
                                    <div className="input-group-append">
                                        <button type="submit" className="btn btn-secondary">Áp dụng</button>
                                    </div>
                                </div>
                            </form> */}
                        </div>
                        <div className="col-md-8 order-md-1">
                            <form className="needs-validation" noValidate>
                                <hr className="mb-4" />

                                <h4 className="mb-3">Thanh toán</h4>
                                <div className="d-block my-3">
                                    <p><b><i>Thanh toán qua ví điện tử</i></b></p>
                                    <div className="custom-control custom-radio">
                                        <input id="Payment-VNPay" name="paymentMethod" type="radio" className="custom-control-input" required onChange={() => setPaymentMethod("Payment-VNPay")} />
                                        <label className="custom-control-label" htmlFor="Payment-VNPay">VNPay</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input id="momo" name="paymentMethod" type="radio" className="custom-control-input" required onChange={() => setPaymentMethod("MoMo")} />
                                        <label className="custom-control-label" htmlFor="momo">MoMo</label>
                                    </div>
                                </div>
                                
                                <hr className="mb-4" />
                                <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={handleCheckout} disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SectionContent;
