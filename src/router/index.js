import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Middleware from "../middleware";
import App from "../components/App";
import Auth from "../components/Auth";
import "../App.css";

import Login from "../views/Auth/Login";
import Register from "../views/Auth/Register";
import ResetPassword from "../views/Auth/ResetPassword";
import NewPassword from "../views/Auth/NewPassword";

import Home from "../views/Home";
import Category from "../views/Category";
import CategoryDetail from "../views/Category/CategoryDetail";
import SubCategoryDetail from "../views/Category/SubCategoryDetail";

import Search from "../views/Search";
import Products from "../views/Product";
import ProductDetail from "../views/Product/ProductDetail";

import Settings from "../views/Settings";
import SettingProfile from "../views/Settings/Profile";
import SettingAddress from "../views/Settings/Address";
import SettingPassword from "../views/Settings/Password";

import ArticleTutorial from "../views/Article/ArticleTutorial";
import Article from "../views/Article/Article";
import ArticleDetail from "../views/Article/ArticleDetail";
import Tutorial from "../views/Article/Tutorial";
import TutorialDetail from "../views/Article/TutorialDetail";

import Wishlist from "../views/Wishlist";
import Cart from "../views/Cart";
import Order from "../views/Order";
import OrderDetail from "../views/Order/OrderDetail";

import Checkout from "../views/Checkout";
import Payment from "../views/Payment";
import PaymentDetail from "../views/Payment/PaymentDetail";

function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" exact element={<App render={<Home />} title="Busana Keluarga Muslim Trendy" />} />
            <Route
               path="/login"
               element={
                  <Middleware.Before>
                     <App render={<Auth render={<Login />} />} title="Masuk" />
                  </Middleware.Before>
               }
            />
            <Route
               path="/register"
               element={
                  <Middleware.Before>
                     <App render={<Auth render={<Register />} />} title="Daftar" />
                  </Middleware.Before>
               }
            />
            <Route
               path="/reset-password"
               element={
                  <Middleware.Before>
                     <App render={<Auth render={<ResetPassword />} />} title="Atur ulang kata sandi" />
                  </Middleware.Before>
               }
            />
            <Route
               path="/reset-password/:token"
               element={
                  <Middleware.Before>
                     <App render={<Auth render={<NewPassword />} />} title="Atur ulang kata sandi" />
                  </Middleware.Before>
               }
            />

            <Route path="/category" element={<App render={<Category />} title="Kategori" />} />
            <Route path="/category/:category_id" element={<App render={<CategoryDetail />} title="Loading..." />} />
            <Route path="/category/:category_id/:sub_category_id" element={<App render={<SubCategoryDetail />} title="Loading..." />} />

            <Route path="/search" element={<App render={<Search />} title="Cari Produk" />} />
            <Route path="/products" element={<App render={<Products />} title="Semua Produk" />} />
            <Route path="/product/:slug" element={<App render={<ProductDetail />} title="Loading..." />} />

            <Route path="/article-tutorial" element={<App render={<ArticleTutorial />} title="Artikel & Tutorial" />} />
            <Route path="/article" element={<App render={<Article />} title="Artikel" />} />
            <Route path="/article/:slug" element={<App render={<ArticleDetail />} title="Detail Artikel" />} />
            <Route path="/tutorial" element={<App render={<Tutorial />} title="Tutorial" />} />
            <Route path="/tutorial/:slug" element={<App render={<TutorialDetail />} title="Detail Tutorial" />} />

            <Route
               path="/settings"
               element={
                  <Middleware.After>
                     <App render={<Settings render={<SettingProfile />} route="profile" />} title="Biodata Diri" />
                  </Middleware.After>
               }
            />
            <Route
               path="/settings/address"
               element={
                  <Middleware.After>
                     <App render={<Settings render={<SettingAddress />} route="address" />} title="Daftar Alamat" />
                  </Middleware.After>
               }
            />
            <Route
               path="/settings/password"
               element={
                  <Middleware.After>
                     <App render={<Settings render={<SettingPassword />} route="password" />} title="Ubah Kata Sandi" />
                  </Middleware.After>
               }
            />

            <Route
               path="/wishlist"
               element={
                  <Middleware.After>
                     <App render={<Wishlist />} title="Wishlist" />
                  </Middleware.After>
               }
            />
            <Route
               path="/cart"
               element={
                  <Middleware.After>
                     <App render={<Cart />} title="Keranjang" />
                  </Middleware.After>
               }
            />
            <Route
               path="/checkout"
               element={
                  <Middleware.After>
                     <App render={<Checkout />} title="Checkout" />
                  </Middleware.After>
               }
            />
            <Route
               path="/payment"
               element={
                  <Middleware.After>
                     <App render={<Payment />} title="Menunggu Pembayaran" />
                  </Middleware.After>
               }
            />
            <Route
               path="/payment/:id"
               element={
                  <Middleware.After>
                     <App render={<PaymentDetail />} title="Status Pembayaran" />
                  </Middleware.After>
               }
            />
            <Route
               path="/order"
               element={
                  <Middleware.After>
                     <App render={<Order />} title="Transaksi" />
                  </Middleware.After>
               }
            />
            <Route
               path="/order/:id"
               element={
                  <Middleware.After>
                     <App render={<OrderDetail />} title="Detail Transaksi" />
                  </Middleware.After>
               }
            />
         </Routes>
      </BrowserRouter>
   );
}

export default Router;
