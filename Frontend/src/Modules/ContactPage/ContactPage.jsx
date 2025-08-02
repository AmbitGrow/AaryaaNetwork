import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Admin/Api/Api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import CustomizedStyleleft from "../../assets/CustomizedStyleLeft.png";
import { toast } from "react-toastify";
import QueryImg from "../../assets/Contact/QueryImg.jpg";
import Footer from "../../Components/Footer/Footer";
import "./Contactpage.css";
function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // const selectedPlan = location.state?.selectedPlan || null;
  const [selectedPlan, setSelectedPlan] = useState(
    () => location.state?.selectedPlan || null
  );

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // Clear the scrollTo state after scroll
          navigate(location.pathname, { replace: true, state: {} });
        }, 10); // wait for DOM to render
      }
    }
  }, [location, navigate]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    message: "",
  });
  const regexValidators = {
    // First and last names: Start with a capital letter, allow letters, spaces, hyphens, apostrophes, and must be 2+ characters.
    firstName: /^(?!.*(.)\1{2,})[A-Z][a-zA-Z-' ]{1,}$/,

    // lastName: /^(?!.*(.)\1{2,})[A-Z][a-zA-Z-' ]{1,}$/,
    lastName: /.*[a-zA-Z].*$/,

    // Indian phone number: starts with 6-9, followed by exactly 9 digits.
    phone: /^[6-9]\d{9}$/,

    // Address: at least 5 characters, should not be only numbers or repeating characters.
    address: /^(?!\d+$)(?!.*(.)\1{4,}).{5,}$/,

    // Email: stricter than basic one
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Message: minimum 10 characters, not just the same character or only spaces
    message: /^(?!.*(.)\1{4,})(?!\s+$).{10,}$/,
  };

  const validateForm = () => {
    const newErrors = {};
    for (const field in form) {
      const value = form[field].trim();
      if (!regexValidators[field].test(value)) {
        newErrors[field] = `Enter a valid   ${
          field.charAt(0).toUpperCase() + field.slice(1)
        }`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [errors, setErrors] = useState({});
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPlan, setShowPlan] = useState(true);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // setForm((prev) => ({ ...prev, [name]: value }));
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    setResponseMsg("");
    setLoading(true);

    try {
      const requestBody = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        message: form.message,
      };

      if (selectedPlan) {
        requestBody.selectedPlan = {
          speed: selectedPlan.speed,
          provider: selectedPlan.provider,
          duration: selectedPlan.duration,
          planType: selectedPlan.planType,
          price: selectedPlan.firstTimeTotal || selectedPlan.renewalTotal,
          ottTier: selectedPlan.ottTier,
          tvChannels: selectedPlan.tvChannels,
          router: selectedPlan.router,
          androidBox: selectedPlan.androidBox,
        };
      }

      const res = await API.post("/contact/post", requestBody);

      const data = res.data;

      toast.success(data.message);

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        email: "",
        message: "",
      });
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        setErrors(data.errors || {});
        toast.error(data.message || "Submission failed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setShowPlan(false);
    }
  };

  return (
    <>
      <div className="contact-page-overall">
        <div className="cp-first-section">
          <div className="let-talk-section">
            <h2>Interested in Our Plans? Let’s Talk!</h2>
            <p className="sub-c-title">
              Whether you’re exploring our fixed plans or customizing your own,
              we’d love to hear from you. Fill out the form, and our team will
              get back to you quickly with the details you need.
            </p>

            <div className="c-style-img">
              <img src={CustomizedStyleleft} className="c-style-left-img" />
              <img src={CustomizedStyleleft} className="c-style-right-img" />
            </div>
          </div>
        </div>
        <div className="cp-second-section">
          <div className="contact-grid">
            <div
              className="contact-box contact-box1"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/aaryaa_network?igsh=MXc0eXJ4cWVweG5xcg==",
                  "_blank"
                )
              }
            >
              <div className="contact-box-in contact-box1-in"></div>
              <div className="contact-bottom">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Aaryaa Fibernet</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
            <div
              className="contact-box contact-box2"
              onClick={() =>
                window.open("https://wa.me/917708067932", "_blank")
              }
            >
              <div className="contact-box-in contact-box2-in"></div>
              <div className="contact-bottom">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Whatsapp</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
            <div
              className="contact-box contact-box3"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/WN8AMJ2euCY2b4yK9",
                  "_blank"
                )
              }
            >
              <div className="contact-box-in contact-box3-in"></div>
              <div className="contact-bottom">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Sankarankovil, TamilNadu</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
            <div
              className="contact-box contact-box4"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/aaryaatv/profilecard/?igsh=MXdodjZra3o2MmI2Ng==",
                  "_blank"
                )
              }
            >
              <div className="contact-box-in contact-box1-in"></div>
              <div className="contact-bottom">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Aaryaa Tv</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
            <div
              className="contact-box contact-box5"
              onClick={() =>
                window.open(
                  "https://youtube.com/@aaryaatv?si=N2Ofgg3v6nkQSy5g",
                  "_blank"
                )
              }
            >
              <div className="contact-box-in contact-box5-in"></div>
              <div className="contact-bottom contact-bottom-img">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Youtube</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
            <div
              className="contact-box contact-box6"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/share/1AZnobBpY6/?mibextid=wwXIfr",
                  "_blank"
                )
              }
            >
              <div className="contact-box-in contact-box6-in"></div>
              <div className="contact-bottom">
                {/* <div className="contact-bottom-circle">
                            </div> */}
                <p>Facebook</p>
              </div>
              <div className="contact-top">
                <FaArrowRightLong className="arrow-icon" />
              </div>
            </div>
          </div>
        </div>
        <div className="cp-third-section" id="contact-form-section">
          <div className="query">
            <div className="left-query">
              <img src={QueryImg} className="left-query-img" />
            </div>

            <div className="right-query">
              {selectedPlan && showPlan && (
                <div className="selected-plan-summary-contact">
                  <h4>Selected Plan</h4>
                  <ul>
                    <li>
                      <b>Speed : </b> {selectedPlan.speed}
                    </li>
                    <li>
                      <b>Provider : </b> {selectedPlan.provider}
                    </li>
                    <li>
                      <b>Duration : </b> {selectedPlan.duration}
                    </li>
                    <li>
                      <b>Type : </b> {selectedPlan.planType}
                    </li>
                    <li>
                      <b>Price : </b> ₹
                      {selectedPlan.firstTimeTotal || selectedPlan.renewalTotal}
                    </li>
                    {selectedPlan.ottTier &&
                      selectedPlan.ottTier !== "None" && (
                        <li>
                          <b>OTT Tier : </b> {selectedPlan.ottTier}
                        </li>
                      )}
                    {selectedPlan.tvChannels &&
                      selectedPlan.tvChannels !== "None" && (
                        <li>
                          <b>TV Channels : </b> {selectedPlan.tvChannels}
                        </li>
                      )}
                    {selectedPlan.router && selectedPlan.router !== "None" && (
                      <li>
                        <b>Router : </b> {selectedPlan.router}
                      </li>
                    )}
                    {selectedPlan.androidBox && (
                      <li>
                        <b>Android Box : </b> Included
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="query-header">
                  <h1>Get In Touch</h1>
                  <p>
                    I'm always open to new opportunities. Feel free to drop me a
                    line if having any questions or projects.
                  </p>
                </div>
                <div className="query-box">
                  <div className="input-flex-box">
                    <h3>First Name</h3>
                    <div className="input-div">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter Your First Name"
                        className="input-box"
                        value={form.firstName}
                        onChange={handleChange}
                      ></input>
                      {errors.firstName && (
                        <p className="error-contact">{errors.firstName}</p>
                      )}
                    </div>
                  </div>
                  <div className="input-flex-box">
                    <h3>Last Name</h3>
                    <div className="input-div">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter Your Last Name"
                        className="input-box"
                        value={form.lastName}
                        onChange={handleChange}
                      ></input>
                      {errors.lastName && (
                        <p className="error-contact">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="query-box">
                  <div className="input-flex-box">
                    <h3>Phone Number</h3>
                    <div className="input-div">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter your Phone Number"
                        className="input-box"
                        value={form.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="error-contact">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="input-flex-box">
                    <h3>Address</h3>
                    <div className="input-div">
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter your Address"
                        className="input-box"
                        value={form.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <p className="error-contact">{errors.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="address-box input-flex-box">
                  <h3>Email Address</h3>
                  <div className="input-div">
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter your Email Address"
                      className="input-adr-box"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="error-contact">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="message input-flex-box">
                  <h3>Message</h3>
                  <div className="input-div">
                    <textarea
                      name="message"
                      placeholder="Enter your message here..."
                      rows={6}
                      cols={50}
                      className="message-box"
                      value={form.message}
                      onChange={handleChange}
                      style={{ resize: "none" }}
                    />
                    {errors.message && (
                      <p className="error-contact">{errors.message}</p>
                    )}
                  </div>
                </div>
                <div className="button-div">
                  <button
                    className="send-message"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="cp-last-section footer-section">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ContactPage;
