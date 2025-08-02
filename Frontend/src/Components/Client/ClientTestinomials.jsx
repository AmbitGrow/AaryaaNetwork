import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Client/ClientTestimonials.css";
import doticon from "../../assets/dot-icon.png";
import logo from "../../assets/AaryaaLogo.png";
import name1 from "../../assets/ClientTestinomials/name1.png";
import name2 from "../../assets/ClientTestinomials/name2.png";
import name3 from "../../assets/ClientTestinomials/name3.png";
import name4 from "../../assets/ClientTestinomials/name4.png";
import name5 from "../../assets/ClientTestinomials/name5.png";
import name6 from "../../assets/ClientTestinomials/name6.png";
import name7 from "../../assets/ClientTestinomials/name7.png";
import { IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";

const testimonials = [
  {
    name: "Gv Murugan",
    rating: 5,
    feedback:
      "I've been using Aaryaa Network's fiber internet for a while now, and the experience has been flawless. The speed is consistent, and I haven't faced a single outage. Their customer support team is friendly and always resolves queries promptly. Highly recommend their service to anyone looking for a reliable internet provider!",
    image: name1,
  },
  {
    name: "Unique Samy",
    rating: 5,
    feedback:
      "Fast and Reliable Internet! Aaryaa Network has exceeded my expectations! The internet speed is incredible, and I can stream, work, and game without any interruptions. The best part is their quick response to any queries—truly a team you can rely on!",
    image: name2,
  },
  {
    name: "Seenu Selvaraj",
    rating: 5,
    feedback:
      "I had lots experience in fiber network connection.. also I had lots of fight with network providers in chennai , madurai cities..but not facing single issues on my fiber connection on Sankarankovil with Aarya network .. thanks to brilliant team to solving all issues ...Thank you ♥️..I have Railwire & Bsnl connections ..",
    image: name3,
  },
  {
    name: "Baskaran Basu G",
    rating: 5,
    feedback:
      "I enquired them about the plans and the installation completed on the same day. They are very helpful on queries and always reach us incase of issues.",
    image: name4,
  },
  {
    name: "Kaniraj Kani",
    rating: 4,
    feedback:
      "I've been a customer of Aaryaa Network for several years now and I'm consistently impressed with their service. Their network is reliable and fast, and I've never had any major outages. Their customer service is also excellent - they're always helpful and responsive. I highly recommend Aaryaa Network to anyone looking for a great network provider by kannan",
    image: name5,
  },
  {
    name: "Vignesh Mani",
    rating: 5,
    feedback:
      "Congratulations Young Entrepreneur.. You are providing great customer services.. It made your brand in sankarankovil..",
    image: name6,
  },
  {
    name: "Rama Chandran C",
    rating: 5,
    feedback:
      "நகரில் சிறந்த முறையில் ஒலி ஒளி சேவையும், தொலை தொடர்பு சேவையும் செய்து வருவதற்க்கு வாழ்த்துக்கள் இராமச்சந்திரன் ஆலோசகர்காப்பீடு / முதலீடுஎல்.ஐ .சி. மற்றும் எக்விடாஸ் வங்கி சமுதாயச்சேவையில் வெள்ளி விழா கண்ட புதிய பார்வை தன்னார்வத் தொண்டு அமைப்பின் மாத இதழ் ஆசிரியர்",
    image: name7,
  },
];

export default function SwiperTestimonialSlider() {
  return (
    <div className="testimonial-section">
      <div className="testimonial-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 1.5,
              spaceBetween: 100,
            },
            1050: {
              slidesPerView: 2,
              spaceBetween: -100,
            },
          }}
          centeredSlides={true}
          loop={true}
          // spaceBetween={-150}
          speed={300}
          autoplay={{
            delay: 15000,
            disableOnInteraction: false,
          }}
          pagination={{
            el: ".testimonial-pagination",
            clickable: true,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src={doticon} />

                  <div className="profile">
                    <div
                      className="profile-img"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "0px",
                      }}
                    ></div>
                    <h3>{item.name}</h3>
                  </div>
                </div>
                <div className="testimonial-rating">
                  <p className="star-icon">
                    {[...Array(item.rating)].map((_, i) => (
                      <IoIosStar
                        key={`filled-${i}`}
                        className="start-icon-fill"
                      />
                    ))}
                    {[...Array(5 - item.rating)].map((_, i) => (
                      <IoIosStarOutline
                        key={`empty-${i}`}
                        className="start-icon-empty"
                      />
                    ))}
                  </p>
                  <p className="rating-count">
                    <span>{item.rating}</span> / 5
                  </p>
                </div>
                <div className="testimonial-divider-div">
                  <hr className="testimonial-divider" />
                </div>
                <div className="feedback-div">
                  <p className="testimonial-text">{item.feedback}</p>
                </div>
                <div className="arayaa-logo-bottom">
                  <div className="logo-bottom">
                    <img src={logo} alt="Logo" />
                    <p>Network</p>
                  </div>
                </div>

                <div className="testimonial-counter">
                  <p>
                    <span>{index + 1}</span> / {testimonials.length}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="testimonial-controls">
            <div className="testimonial-pagination"></div>
            <div className="custom-navigation">
              <div className="custom-prev">
                <IoArrowBackSharp />
              </div>
              <div className="custom-next">
                <IoMdArrowForward />
              </div>
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
}
