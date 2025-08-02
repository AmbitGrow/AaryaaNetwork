import React from 'react';
import { Routes, Route } from "react-router-dom";
import WebRouter from './WebRouter';
import './App.css';
import AdminApp from './Admin/AdminApp.jsx';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<WebRouter />} />
         <Route path="/admin/*"  element={<AdminApp/>}/>
      </Routes>
           <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
     </>
  );
}

export default App;
