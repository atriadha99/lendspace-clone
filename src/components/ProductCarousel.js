// src/components/ProductCarousel.js
import React from 'react';
import Slider from 'react-slick';

// Import CSS untuk react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Contoh data banner (bisa dari API)
const bannerData = [
  { img: 'https://i.ibb.co/6yv4d66/camera.jpg', title: 'Sewa Kamera Diskon 20%!' },
  { img: 'https://i.ibb.co/P9M3r2B/drill.jpg', title: 'Peralatan Tukang Lengkap' },
  { img: 'https://i.ibb.co/k3b4t0P/car.jpg', title: 'Jelajahi Kota, Sewa Mobil Sekarang' },
];

function ProductCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {bannerData.map((banner, index) => (
          <div key={index}>
            <div className="carousel-slide" style={{ backgroundImage: `url(${banner.img})` }}>
              <h3>{banner.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductCarousel;