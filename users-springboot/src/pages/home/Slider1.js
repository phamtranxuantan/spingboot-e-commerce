import React from "react";
const Slider1 = () => {
    return(
        <section class="section-intro padding-y">
            <div class="container">
            <div id="carousel1_indicator" class="slider-home-banner carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#carousel1_indicator" data-slide-to="0" class="active"></li>
                <li data-target="#carousel1_indicator" data-slide-to="1"></li>
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                <img src={require('../../assets/images/banners/slide-lg-3.jpg')} alt="First slide"/> 
                </div>
                <div class="carousel-item">
                <img src={require('../../assets/images/banners/slide-lg-2.jpg')} alt="Second slide"/>
                </div>
            </div>
            <a class="carousel-control-prev" href="#carousel1_indicator" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carousel1_indicator" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
            </div> 
                
            </div> 
            </section>
    )
}
export default Slider1;