import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Modules/HomePage/HomePage'
import Header from './Components/Header/Header'
import ContactPage from './Modules/ContactPage/ContactPage'
import CustomizedPage from './Modules/CustomizedPage/CustomizedPage.jsx'
import AaryaaTvPage from './Modules/AaaryaTvPage/AaryaaTvPage'
import ScrollToTop from './Components/ScrollToTop.jsx'
import IntroLoader from './Components/IntroLoader/IntroLoader.jsx'

function WebRouter() {
  const [showMainContent, setShowMainContent] = useState(false);
  return (
      <div>
      {!showMainContent ? (
        <IntroLoader onFinish={() => setShowMainContent(true)} />
      ) : (
        <>
          <div className="header">
            <Header />
          </div>
          <ScrollToTop />
          <div className="pages">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/customizedplan" element={<CustomizedPage />} />
              <Route path="/aaryaaTV" element={<AaryaaTvPage />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default WebRouter