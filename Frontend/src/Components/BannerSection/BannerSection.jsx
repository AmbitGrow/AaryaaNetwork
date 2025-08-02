import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./BannerSection.css";
import { useNavigate } from "react-router-dom";


export default function BannerSection() {
  const navigate = useNavigate();

  const banners = [
    {
      title: "Enjoy Seamless Streaming With Our Lightning",
      subtitle: "Fast Fiber Internet",
      desc: "Stream, game, and work without interruptions. Enjoy fiber-speed internet built for your lifestyle.",
      className: "banner1",
      button: "Check Our Plans",
    },
    {
      title: "Aaryaa Fibernet – Speed That Connects.",
      subtitle: "Smart. Seamless. Secure.",
      desc: "Enjoy blazing-fast internet, HD TV, OTT apps, gaming, and 24×7 surveillance all with one powerful fibre connection.",
      className: "banner2",
      button: "Check Our Plans",
    },
    {
      title: "Live the Fiber Life with Aaryaa",
      subtitle: "Next-Level Streaming. Next-Level Speed",
      desc: "Aaryaa delivers blazing-fast internet and nonstop entertainment for your modern lifestyle",
      className: "banner3",
      button: "Check Our Plans",
    },
    {
      title: "Live the Fiber Life with Aaryaa",
      subtitle: "Next-Level Streaming. Next-Level Speed",
      desc: "Aaryaa delivers blazing-fast internet and nonstop entertainment for your modern lifestyle",
      className: "banner1",
      button: "Check Our Plans",
    },
    {
      title: "Live the Fiber Life with Aaryaa",
      subtitle: "Next-Level Streaming. Next-Level Speed",
      desc: "Aaryaa delivers blazing-fast internet and nonstop entertainment for your modern lifestyle",
      className: "banner2",
      button: "Check Our Plans",
    },
  ];

  return (
    <div className="hcontainer">
      <div className="herosection first-section">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          className="banner-swiper"
        >
          {banners.map((item, index) => (
            <SwiperSlide className={`banner ${item.className}`} key={index}>
              <div className="linear-black">
                <div className="banner-txt">
                  <h2 className="ban-heading">{item.title}</h2>
                  <h3 className="ban-subheading">{item.subtitle}</h3>
                  <p className="dec">{item.desc}</p>
                  <div className="banner-btn">
                    <div className="banner-btn-in"  onClick={() => navigate("/customizedplan")}>
                      <p>{item.button}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="custom-pagination"></div>
        </Swiper>
      </div>
    </div>
  );
}
