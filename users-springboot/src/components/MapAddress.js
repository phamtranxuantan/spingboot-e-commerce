import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapUpdater({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView([coords.lat, coords.lng], map.getZoom()); 
        }
    }, [coords, map]);
    return null;
}

export default function MapAddress({ coords }) {
    const position = coords ? [coords.lat, coords.lng] : ["106.7822759639199","10.835460127679875"]; 
    return (
        <div style={{ height: '250px', width: '100%' }}>
           <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <MapUpdater coords={coords} /> 
                {coords && ( 
                    <Marker position={position}>
                        <Popup>
                            Bạn đang ở đây! <br /> ({coords.lat}, {coords.lng})
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}
