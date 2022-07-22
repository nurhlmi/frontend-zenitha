import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { LocalMallOutlined } from "@mui/icons-material";

import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../style/Slider.css";

import { apiUrl } from "../variable/Url";
import { Link as RouterLink } from "react-router-dom";
import { ProductCard } from "../components/Card";
import { useRecoilState } from "recoil";
import { authentication } from "../store/Authentication";

export default function Home() {
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);

   const [banner, setBanner] = useState([]);
   const [product, setProduct] = useState();
   const [productHighlight, setProductHighlight] = useState();
   const [secondBanner, setSecondBanner] = useState([]);
   const [footerBanner, setFooterBanner] = useState();

   const getBanner = async () => {
      await axios
         .get(`${apiUrl}/banner/fetch`)
         .then((res) => {
            // console.log(res.data.data);
            setBanner(res.data.data);
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };
   const getProductHighlight = async () => {
      await axios
         .get(`${apiUrl}/product_slider/fetch`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data);
            setProductHighlight(res.data);
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };
   let params;
   if (auth.auth === true) {
      params = {
         user_id: auth.user.id,
      };
   }
   const getProduct = async () => {
      await axios
         .get(`${apiUrl}/product/fetch`, {
            params: params,
         })
         .then((res) => {
            // console.log(res.data.data);
            setProduct(res.data.data);
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };
   const getSecondBanner = async () => {
      await axios
         .get(`${apiUrl}/setting/second_banner/fetch`)
         .then((res) => {
            // console.log(res.data.data);
            setSecondBanner(res.data.data);
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };
   const getFooterBanner = async () => {
      await axios
         .get(`${apiUrl}/setting/footer_banner/fetch`)
         .then((res) => {
            // console.log(res.data.data);
            setFooterBanner(res.data.data);
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };

   const settingBanner = {
      dots: true,
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 600,
            settings: {
               dots: false,
               arrows: false,
            },
         },
      ],
   };

   useEffect(() => {
      getBanner();
      getProductHighlight();
      getProduct();
      getSecondBanner();
      getFooterBanner();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Fragment>
         <Box sx={{ mb: 4 }}>
            <Slider {...settingBanner}>
               {banner.map((value, index) => (
                  <Box component={Link} href={value.url} key={index}>
                     <img alt={`Banner ${value.order}`} src={value.banner_url} />
                  </Box>
               ))}
            </Slider>
         </Box>
         <Container>
            {productHighlight !== undefined && productHighlight.data.length > 0 && (
               <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                     Lagi Promo
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                     <Grid item xs={0} sm={4} md={3} sx={{ display: { xs: "none", sm: "block" } }}>
                        <img alt="Logo" src={`/assets/images/promo.webp`} width="100%" />
                     </Grid>
                     {productHighlight.data.map((value, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                           <ProductCard
                              name={value.product.product_name}
                              slug={value.product.main_product.product_slug}
                              image={value.product.image}
                              price={value.product.price}
                              discount={value.product.discount}
                              discount_type={value.product.discount_type}
                              discount_group={value.product.discount_group}
                              discount_user={value.product.discount_user}
                           />
                        </Grid>
                     ))}
                  </Grid>
               </Box>
            )}
            <Box sx={{ mb: 6 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Produk Terbaru
               </Typography>
               {product !== undefined ? (
                  <Fragment>
                     {product.data.length > 0 ? (
                        <Fragment>
                           <Grid container spacing={{ xs: 1, sm: 2 }}>
                              {product.data.map((value, index) => (
                                 <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                                    <ProductCard
                                       name={value.product_name}
                                       slug={value.main_product.product_slug}
                                       image={value.image}
                                       price={value.price}
                                       discount={value.discount}
                                       discount_type={value.discount_type}
                                       discount_group={value.discount_group}
                                       discount_user={value.discount_user}
                                    />
                                 </Grid>
                              ))}
                           </Grid>
                           {product.meta.total > 10 && (
                              <Box sx={{ textAlign: "center", mt: 2 }}>
                                 <Button variant="outlined" component={RouterLink} to="/products">
                                    Lihat Semua
                                 </Button>
                              </Box>
                           )}
                        </Fragment>
                     ) : (
                        <Box
                           sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              height: "60vh",
                              color: "text.secondary",
                           }}
                        >
                           <LocalMallOutlined fontSize="large" />
                           <Typography mt={1}>Belum ada produk terbaru</Typography>
                        </Box>
                     )}
                  </Fragment>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                     <CircularProgress />
                  </Box>
               )}
            </Box>
         </Container>
         <Grid container sx={{ mb: 6 }}>
            {secondBanner.map((value, index) => (
               <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ mr: { xs: 0, md: 1 } }}>
                     <img alt={`Banner${value.order}`} src={value.banner} width="100%" />
                  </Box>
               </Grid>
            ))}
         </Grid>
         {footerBanner !== undefined && (
            <Container>
               <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                     <Typography fontWeight="bold" mb={2} sx={{ fontSize: { xs: "25px", sm: "30px" }, textTransform: "uppercase" }}>
                        Brand yang tersedia di toko kami
                     </Typography>
                     {/* <Typography color="text.secondary">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex sunt maxime rem, officiis, voluptatibus itaque nostrum quaerat velit, vitae
                        asperiores labore temporibus assumenda cumque debitis alias iste a similique quia.
                     </Typography> */}
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <img alt="Footer Banner" src={footerBanner.banner} width="100%" />
                  </Grid>
               </Grid>
            </Container>
         )}
      </Fragment>
   );
}
