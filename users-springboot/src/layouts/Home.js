import React, { useState, useEffect } from "react";
// index-1
import Slider from "../pages/home/Slider";
import Deal from "../pages/home/Deal";
import Apparel from "../pages/home/Apparel";
import Electonics from "../pages/home/Electonics";
import Request from "../pages/home/Request";
import Items from "../pages/home/Items";
import Services from "../pages/home/Services";
import Region from "../pages/home/Region";
import Subscribe from "../pages/home/Subscribe";
// index-2
import Slider1 from "../pages/home/Slider1";
import Section from "../pages/home/Section";
import Banner from "../pages/home/Banner";
import Section1 from "../pages/home/Section1";
import Banner1 from "../pages/home/Banner1";

import { GET_ALL } from "../api/apiService";

function Home(props) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Lấy danh sách danh mục
    GET_ALL('categories', {})
      .then(response => {
        console.log("Fetched categories:", response.content); // In ra các giá trị đã thấy được
        setCategories(response.content); // Đặt state categories
      })
      .catch(error => {
        console.error('Failed to fetch categories:', error); // Xử lý lỗi
      });
  }, []);

  return (
    <div className="container">
      {/* templete-index2 */}
      <Slider1 />
      {categories.map(category => (
        <Section 
          key={category.categoryId}
          categoryName={category.categoryName} 
          categoryId={category.categoryId} 
        />
      ))}
      {/* <Banner />
      <Section1 />
      <Banner1/> */}
      {/* templete-index1 */}
      {/* <Slider />
      <Deal />
      <Apparel />
      <Electonics />
      <Request />
      <Items />
      <Services />
      <Region />
      <article className="my-4">
        <img src={require('../assets/images/banners/ad-sm.png')} className="w-100" alt="Ad" />
      </article>
      <Subscribe /> */}
    </div>  
  );
}

export default Home;