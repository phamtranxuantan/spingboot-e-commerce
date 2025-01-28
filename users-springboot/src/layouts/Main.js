import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import Section from '../pages/home/Section';
import ProductDetail from '../pages/detail/ProductDetail';
import SectionContentListGird from '../pages/listtinggird/SectionContent';
import SectionContentCart from '../pages/cart/SectionContent';
import SectionContentOrder  from '../pages/order/SectionContent';
const Main = () => (
    <main>
        <Routes>
            <Route path="/Login" element={<UserLogin />} />
            <Route path="/Register" element={<UserRegister />} />
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Section />} />
            <Route path="/Detail/:productId" element={<ProductDetail />} />
            <Route path="/ListingGrid" element={<SectionContentListGird />} />
            <Route path="/Cart" element={<SectionContentCart />} />
            <Route path="/Order" element={<SectionContentOrder />} />
        </Routes>
    </main>
);

export default Main;