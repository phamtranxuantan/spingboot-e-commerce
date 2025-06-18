import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import MapTracking from "../../../components/MapTracking";
import ClipLoader from "react-spinners/ClipLoader";

export const TrackMapOrders = ({ isOpenMaps, setIsOpenMaps, orderAddress }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [shopCoords, setShopCoords] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY_OPEN_CAGE_DATA;
  const shopAddress = "Phường Tăng Nhơn Phú B, Quận 9, Hồ Chí Minh";

  useEffect(() => {
    if (orderAddress) {
      axios
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            orderAddress
          )}&key=${apiKey}`
        )
        .then((res) => {
          const { lat, lng } = res.data.results[0].geometry;
          setUserCoords({ lat, lng });
        })
        .catch((error) => {
          console.error("Lỗi khi gọi OpenCage API:", error);
        });
    }
  }, [orderAddress]);

  useEffect(() => {
    axios
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          shopAddress
        )}&key=${apiKey}`
      )
      .then((res) => {
        const { lat, lng } = res.data.results[0].geometry;
        setShopCoords({ lat, lng });
      })
      .catch((err) => console.error("Lỗi khi lấy tọa độ shop:", err));
  }, []);

  useEffect(() => {
    if (!isOpenMaps) {
      setUserCoords(null);
    }
  }, [isOpenMaps]);
  return (
    <>
      <Modal show={isOpenMaps} onHide={() => setIsOpenMaps(false)} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Theo dõi đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '500px', overflowY: 'auto' }}>
          {userCoords ? (
            <MapTracking userCoords={userCoords} shopCoords={shopCoords} />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
              <ClipLoader color="#h876f5" size={50} />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
