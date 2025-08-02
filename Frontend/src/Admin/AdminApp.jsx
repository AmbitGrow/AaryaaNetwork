import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ViewPlans from "./Pages/ViewPlans";
import EditPlan from "./Pages/EditPlans";
import AddPlan from "./Pages/AddPlans";
import GST from "./Pages/UpdateGST";
import SidebarLayout from "./Components/SideBarLayout";
import Settings from "./Pages/Settings";
import PrivateRouter from "./Hooks/PrivateRouter";


function AdminApp() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route
            path="dashboard"
            element={
              <PrivateRouter>
                <Dashboard />
              </PrivateRouter>
            }
          />
          <Route
            path="view-plans"
            element={
              <PrivateRouter>
                <ViewPlans />
              </PrivateRouter>
            }
          />
          <Route
            path="edit-plans/:id"
            element={
              <PrivateRouter>
                <EditPlan />
              </PrivateRouter>
            }
          />
          <Route
            path="add-plans"
            element={
              <PrivateRouter>
                <AddPlan />
              </PrivateRouter>
            }
          />
          <Route
            path="update-gst"
            element={
              <PrivateRouter>
                <GST />
              </PrivateRouter>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRouter>
                <Settings />
              </PrivateRouter>
            }
          />
        </Route>
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

export default AdminApp;
