import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import * as Middleware from "../middleware/App";
import App from "../components/App";
import Auth from "../components/Auth";

import Login from "../views/Auth/Login";
import Register from "../views/Auth/Register";
import ResetPassword from "../views/Auth/ResetPassword";

import Home from "../views/Home";
import Category from "../views/Category";
import CategoryDetail from "../views/Category/Detail";

import Search from "../views/Search";
import Products from "../views/Product/";
import ProductDetail from "../views/Product/Detail";

import Settings from "../views/Settings";
import SettingAddress from "../views/Settings/Address";
import SettingPassword from "../views/Settings/Password";

// import Article from "../views/Article";
// import ArticleDetail from "../views/Article/Article";
// import TutorialDetail from "../views/Article/Tutorial";

import Wishlist from "../views/Wishlist";
import Cart from "../views/Cart";
import Order from "../views/Order";
// import OrderDetail from "../views/Order/Detail";

// import Checkout from "../views/Checkout";
// import Payment from "../views/Payment";

function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" exact element={<App render={<Home />} title="Busana Keluarga Muslim Trendy" />} />
            <Route path="/login" element={<App render={<Auth render={<Login />} />} title="Masuk" />} />
            <Route path="/register" element={<App render={<Auth render={<Register />} />} title="Daftar" />} />
            <Route path="/reset-password" element={<App render={<Auth render={<ResetPassword />} />} title="Atur ulang kata sandi" />} />

            <Route path="/category" element={<App render={<Category />} title="Kategori" />} />
            <Route path="/category/:brand_id/:category_id" element={<App render={<CategoryDetail />} title="Detail Kategori" />} />

            <Route path="/search" element={<App render={<Search />} title="Cari Produk" />} />
            <Route path="/products" element={<App render={<Products />} title="Semua Produk" />} />
            <Route path="/product/:product_id" element={<App render={<ProductDetail />} title="Detail Produk" />} />

            <Route path="/settings" element={<App render={<Settings />} title="Pengaturan" />} />
            <Route path="/settings/address" element={<App render={<SettingAddress />} title="Daftar Alamat" />} />
            <Route path="/settings/password" element={<App render={<SettingPassword />} title="Ganti Password" />} />

            <Route path="/wishlist" element={<App render={<Wishlist />} title="Wishlist" />} />
            <Route path="/cart" element={<App render={<Cart />} title="Keranjang" />} />
            <Route path="/order" element={<App render={<Order />} title="Pesanan" />} />
         </Routes>
      </BrowserRouter>
   );
}

export default Router;
