import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { GET_ALL } from "../../../api/apiService";
import { TrackMapOrders } from "./TrackMapOrders";
const OrderProfile = () => {
  const [orders, setOrders] = useState([]);
  const [isOpenMaps, setIsOpenMaps] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const emailId = localStorage.getItem("userEmail");
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await GET_ALL(`users/${emailId}/orders`);
        setOrders(response);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);


  const exportToPDF = (orderId) => {
    const element = document.getElementById(`order-${orderId}`);
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order-${orderId}.pdf`);
    });
  };
  const handleTrackMapClick = (address) => {
    setCurrentAddress(address);
    setIsOpenMaps(true);
  };

  if (!orders) {
    return <ClipLoader color="#fff" size={20} />
  }

  return (
    <div className="container-fluid px-4">
      <div className="row">
        <main className="col-12">
          {orders.map((order) => (
            <article className="card mb-4 shadow-sm" id={`order-${order.orderId}`} key={order.orderId}>
              <header className="card-header d-flex justify-content-between align-items-center">
                <strong className="d-inline-block">Mã đơn hàng: {order.orderId}</strong>
                <span>Ngày đặt hàng: {new Date(order.orderDate).toLocaleDateString()}</span>
                <button onClick={() => exportToPDF(order.orderId)} className="btn btn-sm btn-outline-secondary">
                  <i className="fa fa-print me-1"></i> Xuất PDF
                </button>
              </header>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <h6 className="text-muted">Giao hàng đến</h6>
                    <p className="mb-1">Tên: {order.orderAddress?.name}</p>
                    <p className="mb-1">Điện thoại: {order.orderAddress?.phone}</p>
                    <p className="mb-1">Email: {order.email}</p>
                    <p>{order.orderAddress?.addressDetail}</p>
                  </div>

                  <div className="col-md-4">
                    <h6 className="text-muted">Thanh toán</h6>
                    <span className="text-success d-block mb-2">
                      <i className="fab fa-lg fa-cc-visa me-1"></i> {order.payment?.paymentMethod}
                    </span>
                    <p className="fw-bold">Tổng giá: {order.totalAmount?.toLocaleString()} VND</p>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    {order.orderItems?.map((item) => (
                      <tr key={item.orderItemId}>
                        <td width="65">
                          <img
                            src={` ${item.product.imageProduct}`}
                            className="img-thumbnail"
                            alt={item.product.productName}
                          />
                        </td>
                        <td>
                          <p className="mb-0 fw-semibold">{item.product.productName}</p>
                          <var className="price text-muted">
                            {item.orderedProductPrice.toLocaleString()} VND
                          </var>
                        </td>
                        <td>
                          <small>Danh mục</small>
                          <br />
                          {item.product.categoryName}
                        </td>
                        <td width="250">
                          <a className="btn btn-outline-primary btn-sm me-2" onClick={() => handleTrackMapClick(order.orderAddress?.addressDetail)}>
                            Theo dõi đơn hàng
                          </a>
                          <TrackMapOrders isOpenMaps={isOpenMaps}
                            setIsOpenMaps={setIsOpenMaps}
                            orderAddress={currentAddress} />
                          {/* <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              Xem thêm
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">Return</a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">Cancel order</a>
                              </li>
                            </ul>
                          </div> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};

export default OrderProfile;