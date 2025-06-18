import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SectionContentCart from '../pages/cart/SectionContent';
import ProductDetail from '../pages/detail/ProductDetail';
import Section from '../pages/home/Section';
import SectionContentListGird from '../pages/listtinggird/SectionContent';
import GoogleCallback from '../pages/login/GoogleCallback';
import SectionContentOrder from '../pages/order/SectionContent';
import AccountOverviewProfile from '../pages/profile/AccountOverviewProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import IndexAccountProfile from '../pages/profile/IndexAccountProfile';
import OrderProfile from '../pages/profile/orders/OrderProfile';
import SettingProfile from '../pages/profile/SettingProfile';
import AddressProfile from '../pages/profile/address/AddressProfile';
import SupportProfile from '../pages/profile/support/SupportProfile';
import Home from './Home';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';

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
            <Route path="/oauth2/callback/google" element={<GoogleCallback />} />
            <Route path="/IndexAccountProfile" element={<IndexAccountProfile />}>
                <Route index element={<AccountOverviewProfile />} /> 
                <Route path="AccountOverview" element={<AccountOverviewProfile />} /> 
                <Route path="OrderProfile" element={<OrderProfile />} />
                <Route path="SettingProfile" element={<SettingProfile/>} />
                <Route path="ChangePassword" element={<ChangePassword/>} />
                <Route path="AddressProfile" element={<AddressProfile/>} />
                <Route path="SupportProfile" element={<SupportProfile/>} />
            </Route>
        </Routes>
    </main>
);

export default Main;