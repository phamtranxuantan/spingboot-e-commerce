import React, {  useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import Routing from "./Routing";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    //iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// function Routing({ userCoords, shopCoords }) {
//     const map = useMap();

//     useEffect(() => {
//         if (!userCoords || !shopCoords) return;

//         const routingControl = L.Routing.control({
//             waypoints: [
//                 L.latLng(shopCoords.lat, shopCoords.lng),
//                 L.latLng(userCoords.lat, userCoords.lng)
//             ],
//             lineOptions: {
//                 styles: [{ color: 'blue', weight: 4 }]
//             },
//             addWaypoints: false,
//             draggableWaypoints: false,
//             fitSelectedRoutes: true,
//             show: false
//         }).addTo(map);

//         return () => {
//             map.removeControl(routingControl);
//         };
//     }, [userCoords, shopCoords, map]);

//     return null;
// }

const shopIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5860/5860579.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
});

// function MapUpdater({ userCoords, shopCoords }) {
//     const map = useMap();

//     useEffect(() => {
//         if (userCoords && shopCoords) {
//             const bounds = L.latLngBounds(
//                 [userCoords.lat, userCoords.lng],
//                 [shopCoords.lat, shopCoords.lng]
//             );
//             map.fitBounds(bounds, { padding: [50, 50] });
//         } else if (userCoords) {
//             map.setView([userCoords.lat, userCoords.lng], 13);
//         } else if (shopCoords) {
//             map.setView([shopCoords.lat, shopCoords.lng], 13);
//         }
//     }, [userCoords, shopCoords, map]);

//     return null;
// }

export default function MapTracking({ userCoords, shopCoords }) {
    const [routeCoords, setRouteCoords] = useState([]);
    const defaultPosition = [10.835460127679875, 106.7822759639199];

    const userPosition = userCoords ? [userCoords.lat, userCoords.lng] : defaultPosition;
    const shopPosition = shopCoords ? [shopCoords.lat, shopCoords.lng] : defaultPosition;
    
    console.log("routeCoords maptracking",routeCoords)
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={userPosition}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                {/* Tự động cập nhật view theo user & shop */}
                <Routing onRouteReady={setRouteCoords} userCoords={userCoords} shopCoords={shopCoords} />

                {/* Marker cho người dùng */}
                {userCoords && (
                    <Marker position={userPosition}>
                        <Popup>
                            Vị trí giao hàng<br />({userCoords.lat}, {userCoords.lng})
                        </Popup>
                    </Marker>
                )}

                {/* Marker cho shop với icon đỏ */}
                {shopCoords && (
                    <Marker position={shopPosition} icon={shopIcon}>
                        <Popup>
                            Vị trí shop<br />({shopCoords.lat}, {shopCoords.lng})
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
