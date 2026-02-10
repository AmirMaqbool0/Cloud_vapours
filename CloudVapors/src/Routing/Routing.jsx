import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Header from "../component/Header/Header";
import SignIn from "../pages/Auth/SignIn/SignIn";
import Signup from "../pages/Auth/Signup/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import Cart from "../pages/Cart/Cart";
import Address from "../pages/CartAddress/Address";
import CartShipping from "../pages/CartShipping/CartShipping";
import Payment from "../pages/Payment/Payment";
import About from "../pages/About/About";
import Contectus from "../pages/ContactUs/Contectus";
import Products from "../pages/Products/Products";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Footer from "../component/Footer/Footer";
import FlavourDetail from "../pages/FlavourDetaiil/FlavourDetail";
import Flavors from "../pages/Flavors/Flavors";
import PrivateRoute from "./PrivateRoute";
import Success from "../pages/Success/Success";
import Cancel from "../pages/Cancel/Cancel";

const Routing = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/productdetail/:id"
            element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart-address"
            element={
              <PrivateRoute>
                <Address />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart-shipping"
            element={
              <PrivateRoute>
                <CartShipping />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/contactus"
            element={
              <PrivateRoute>
                <Contectus />
              </PrivateRoute>
            }
          />
          <Route
            path="/flavour/:id"
            element={
              <PrivateRoute>
                <FlavourDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/flavours"
            element={
              <PrivateRoute>
                <Flavors />
              </PrivateRoute>
            }
          />
          <Route
            path="/success"
            element={
              <PrivateRoute>
                <Success />
              </PrivateRoute>
            }
          />
          <Route
            path="/cancel"
            element={
              <PrivateRoute>
                <Cancel />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default Routing;
