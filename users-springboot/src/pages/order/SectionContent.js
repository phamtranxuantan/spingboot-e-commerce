import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GET_ALL, GET_ID, POST_ADD } from "../../api/apiService";
const SectionContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalPrice, cartId } = location.state || { totalPrice: 0, cartId: null };
    const userEmail = localStorage.getItem("userEmail");
    const [defaultAddress, setDefaultAddress] = useState(null);

    const [loading, setLoading] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
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

        const fetchDefaultAddress = async () => {
            try {
                const response = await GET_ALL(`users/addresses/default?email=${encodeURIComponent(userEmail)}`);
                setDefaultAddress(response);
            } catch (error) {
                console.error('Error fetching default address:', error);
            }
        };

        fetchCartProducts();
        fetchDefaultAddress();
    }, [cartId, userEmail]);

    const handleCheckout = async (values) => {
        if (!cartId || !userEmail) {
            toast.error("Vui lòng kiểm tra giỏ hàng và email người dùng!");
            return;
        }
        if (!values.paymentMethod) {
            toast.warning("Vui lòng chọn phương thức thanh toán!");
            return;
        }
        
        setLoading(true);
        try {
            const response = await POST_ADD(
                `users/${userEmail}/carts/${cartId}/payments/${values.paymentMethod}/order`,
                { name: defaultAddress.name, phone: defaultAddress.phone,  addressDetail: `${defaultAddress.addressDetail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`}, 
            );

            if (response?.orderId && response?.totalAmount) {
                const { orderId } = response;
                const totalAmount = totalPrice || response.totalAmount;

                if (values.paymentMethod === "COD") {
                    toast.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
                    navigate(`/`);
                } else {
                    let paymentUrl;
                    if (values.paymentMethod === "Payment-VNPay") {
                        paymentUrl = await createPaymentUrlVNPay(orderId, totalAmount);
                    } else if (values.paymentMethod === "MoMo") {
                        paymentUrl = await createPaymentUrlMoMo(orderId, totalAmount);
                    }
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        toast.error("Không thể tạo URL thanh toán. Vui lòng thử lại!");
                    }
                }
            } else {
                throw new Error("Phản hồi từ API không hợp lệ.");
            }
        } catch (error) {
            toast.error(error.message || "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

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
    if (!cartId) {
        return <div>Bạn chưa có giỏ hàng</div>;
    }
    const paymentOptions = [
        { code: 'Payment-VNPay', name: "VNPay", description: "Thanh toán qua VNPay" },
        // { code: 'MoMo', name: " MoMo", description: "Thanh toán qua MoMo" },
        // { code: 'COD', name: "Thanh toán khi nhận hàng", description: "Thanh toán trực tiếp khi nhận hàng" }
    ];

    const deliveryOptions = [
       { id: 1, description: "Tiêu Chuẩn", estimated_time: "3-5 ngày", cost: 0 },
        // { id: 2, description: "Giao hàng nhanh", estimated_time: "1-2 ngày", cost: 50000 },
        // { id: 3, description: "Tiết Kiệm", estimated_time: "1-2 ngày", cost: 50000 },
        // { id: 4, description: "Chậm", estimated_time: "1-2 ngày", cost: 50000 },
    ];

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
                                            <img src={` ${product.imageProduct}`} alt={product.productName} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
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
                            <Formik
                                initialValues={{ paymentMethod: '', shippingMethod: '' }}
                                onSubmit={(values) => handleCheckout(values)}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="needs-validation" noValidate>
                                        <h4 className="mb-3">Thông Tin Nhận Hàng</h4>
                                        <p>
                                            {defaultAddress ? (
                                                <>
                                                    <strong>Họ Tên:</strong> {defaultAddress.name} <br />
                                                    <strong>Điện thoại:</strong> {defaultAddress.phone} <br />
                                                    <strong>Địa chỉ:</strong> {defaultAddress.addressDetail}, {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.province} &nbsp;
                                                </>
                                            ) : (
                                                <ClipLoader color="#fff" size={20} />
                                            )}
                                        </p>
                                        <a href="#" onClick={() => navigate("/IndexAccountProfile/AddressProfile")} style={{ color: "#097854" }} className="btn-link">Thay đổi</a>

                                        <hr className="mb-4" />

                                        <h4 className="mb-3">Phương Thức Thanh Toán</h4>
                                        <div className="row my-3">
                                            {paymentOptions.map((data) => (
                                                <div key={data.code} className="col-md-4 mb-3">
                                                    <label
                                                        htmlFor={`payment-${data.code}`}
                                                        className="form-check-label border rounded p-3 d-block bg-light cursor-pointer h-100"
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="form-check me-3">
                                                                    <Field
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                        value={data.code}
                                                                        id={`payment-${data.code}`}
                                                                        name="paymentMethod"
                                                                    />
                                                                </div>
                                                                <div className="small">
                                                                    <span className="fw-semibold text-dark d-block">
                                                                        {data.name}
                                                                    </span>
                                                                    <p id="credit-card-text" className="mt-1 text-muted small mb-0">
                                                                        {data.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>



                                        <h4 className="mb-3">Phương Thức Giao Hàng</h4>
                                        <div className="row my-3">
                                            {deliveryOptions.map((data) => (
                                                <div key={data.id} className="col-md-4 mb-3">
                                                    <label
                                                        htmlFor={`delivery-${data.id}`}
                                                        className="form-check-label border rounded p-3 d-block bg-light z-depth-1 cursor-pointer h-100"
                                                    >
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <span className="d-flex align-items-start">
                                                                <div className="form-check me-3">
                                                                    <Field
                                                                        name="shippingMethod"
                                                                        type="radio"
                                                                        id={`delivery-${data.id}`}
                                                                        value={data.id.toString()}
                                                                        className="form-check-input"
                                                                    />
                                                                </div>
                                                                <div className="small">
                                                                    {data.description}
                                                                    <p id="dhl-text" className="mt-1 text-muted small">
                                                                        {data.estimated_time}
                                                                    </p>
                                                                </div>
                                                            </span>
                                                            <div>
                                                                <p className="small fw-medium mb-0">
                                                                    {data.cost} đ
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <hr className="mb-4" />

                                        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={isSubmitting || loading}>
                                            {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SectionContent;
