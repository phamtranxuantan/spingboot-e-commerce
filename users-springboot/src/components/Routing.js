import { useEffect, useState } from 'react';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import { Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { connectWebSocket,disconnectWebSocket } from '../websocket/websocketService';
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4736/4736213.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

export default function Routing({ userCoords, shopCoords, onRouteReady }) {
    const [routeCoords, setRouteCoords] = useState([]);
    const [vehiclePos, setVehiclePos] = useState(null);
    const [vehicleRoute, setVehicleRoute] = useState([]);
    const map = useMap();

    const apiKey = process.env.REACT_APP_API_KEY_OPENROUTESERVICE; 

    // 1. Tuyến cố định shop → user
    useEffect(() => {
        const fetchRoute = async () => {
            if (!userCoords || !shopCoords) return;

            try {
                const response = await axios.post(
                    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                    {
                        coordinates: [
                            [shopCoords.lng, shopCoords.lat],
                            [userCoords.lng, userCoords.lat]
                        ]
                    },
                    {
                        headers: {
                            Authorization: apiKey,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                const coords = response.data.features[0].geometry.coordinates.map(
                    ([lng, lat]) => [lat, lng]
                );

                setRouteCoords(coords);
                map.fitBounds(L.latLngBounds(coords), { padding: [50, 50] });
            } catch (error) {
                console.error('Lỗi gọi API định tuyến ORS:', error);
            }
        };

        fetchRoute();
    }, [userCoords, shopCoords, apiKey, map]);

    // 2. WebSocket cập nhật tọa độ xe
    // useEffect(() => {
    //     connectWebSocket((data) => {
    //         const { latitude, longitude } = data;

    //         if (latitude && longitude) {
    //             const lat = parseFloat(latitude);
    //             const lng = parseFloat(longitude);
    //             setVehiclePos({ lat, lng });
    //         }
    //     });

    //     return () => {
    //         disconnectWebSocket();
    //     };
    // }, []);
    useEffect(() => {
        // Gán giá trị ban đầu cho vehiclePos bằng tọa độ của shop
        if (shopCoords) {
            setVehiclePos({ lat: shopCoords.lat, lng: shopCoords.lng });
        }

        // Kết nối WebSocket để nhận tọa độ xe
        connectWebSocket((data) => {
            const { latitude, longitude } = data;

            if (latitude && longitude) {
                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);

                // Cập nhật vehiclePos với giá trị từ WebSocket
                setVehiclePos({ lat, lng });
            }
        });

        return () => {
            disconnectWebSocket();
        };
    }, []);

    // 3. Lấy tuyến từ xe đến user
    useEffect(() => {
        const fetchVehicleRoute = async () => {
            if (!vehiclePos || !userCoords) return;
            try {
                const response = await axios.post(
                    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                    {
                        coordinates: [
                            [vehiclePos.lng, vehiclePos.lat],
                            [userCoords.lng, userCoords.lat]
                        ]
                    },
                    {
                        headers: {
                            Authorization: apiKey,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                const coords = response.data.features[0].geometry.coordinates.map(
                    ([lng, lat]) => [lat, lng]
                );
                setVehicleRoute(coords);
            } catch (error) {
                console.error('Lỗi lấy tuyến từ xe đến user:', error);
            }
        };

        fetchVehicleRoute();
    }, [vehiclePos, userCoords]);
    console.log("routeCoords routing",routeCoords)
    return (
        <>
            {/* Tuyến cố định shop → user */}
            {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="#FF9966" weight={4} />
            )}

            {/* Tuyến phụ từ xe → user */}
            {vehicleRoute.length > 0 && (
                <Polyline positions={vehicleRoute} color="blue" weight={3} dashArray="5,10" />
            )}

            {/* Icon xe */}
            {vehiclePos && (
                <LeafletTrackingMarker
                    icon={carIcon}
                    position={vehiclePos}
                    key={`${vehiclePos.lat}-${vehiclePos.lng}`}

                />
            )}
        </>
    );
}
