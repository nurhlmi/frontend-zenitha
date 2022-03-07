import React from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/Slider.css";

import { ProductCard } from "../components/Card";

import { Box, Container, Link, Typography, Button, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { apiUrl } from "../variable/Url";

export default function Home(props) {
   const [banner, setBanner] = React.useState([]);
   const [product, setProduct] = React.useState();
   const [secondBanner, setSecondBanner] = React.useState([]);
   const [footerBanner, setFooterBanner] = React.useState();

   const getBanner = async () => {
      await axios
         .get(`${apiUrl}/banner/fetch`)
         .then((res) => {
            // console.log(res.data.data);
            setBanner(res.data.data);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };
   const getProduct = async () => {
      await axios
         .get(`${apiUrl}/product/fetch`)
         .then((res) => {
            // console.log(res.data.data);
            setProduct(res.data.data);
         })
         .catch((err) => {
            console.log(err.response);
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
            console.log(err.response);
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
            console.log(err.response);
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
   // const settingCategory = {
   //    arrows: true,
   //    infinite: true,
   //    slidesToShow: 8,
   //    slidesToScroll: 1,
   //    responsive: [
   //       {
   //          breakpoint: 1200,
   //          settings: {
   //             slidesToShow: 6,
   //          },
   //       },
   //       {
   //          breakpoint: 900,
   //          settings: {
   //             slidesToShow: 5,
   //          },
   //       },
   //       {
   //          breakpoint: 600,
   //          settings: {
   //             slidesToShow: 3,
   //          },
   //       },
   //       {
   //          breakpoint: 500,
   //          settings: {
   //             slidesToShow: 2,
   //          },
   //       },
   //    ],
   // };
   // const settingPromo = {
   //    arrows: true,
   //    infinite: true,
   //    slidesToShow: 3,
   //    slidesToScroll: 1,
   //    responsive: [
   //       {
   //          breakpoint: 900,
   //          settings: {
   //             slidesToShow: 2,
   //          },
   //       },
   //    ],
   // };

   React.useEffect(() => {
      getBanner();
      getProduct();
      getSecondBanner();
      getFooterBanner();
      window.scrollTo(0, 0);
   }, []);

   return (
      <React.Fragment>
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
            {/* <Box sx={{ mb: 4 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Kategori Produk
               </Typography>
               <Slider {...settingCategory}>
                  {category.map((value, index) => (
                     <div key={index}>
                        <Card key={index} sx={{ mx: 1, border: "1px solid #e0e0e0", boxShadow: "none" }}>
                           <CardActionArea component={RouterLink} to={`/category/zenitha/${value.slug}`}>
                              <CardContent>
                                 <Box
                                    sx={{
                                       width: "100%",
                                       height: "100px",
                                       backgroundPosition: "center center",
                                       backgroundRepeat: "no-repeat",
                                       backgroundImage: `url(/assets/images/categories/${value.image})`,
                                    }}
                                 />
                                 <Typography variant="subtitle2">{value.name}</Typography>
                              </CardContent>
                           </CardActionArea>
                        </Card>
                     </div>
                  ))}
               </Slider>
            </Box> */}
            {/* <Box sx={{ mb: 4 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Lagi Promo
               </Typography>
               <Grid container alignItems="center">
                  <Grid item xs={0} sm={4} md={3} sx={{ display: { xs: "none", sm: "block" } }}>
                     <img alt="Logo" src={`/assets/images/logo-zeni-promo.jpg`} width="100%" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                     <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Slider {...settingPromo}>
                           {products.map(
                              (value, index) =>
                                 value.discount !== null && (
                                    <div key={index}>
                                       <Box sx={{ mx: { xs: 0.5, sm: 1 } }}>
                                          <ProductCard
                                             key={index}
                                             name={value.name}
                                             slug={value.slug}
                                             image={value.image}
                                             price={value.price}
                                             discount={value.discount}
                                             discount_price={value.discount_price}
                                          />
                                       </Box>
                                    </div>
                                 )
                           )}
                        </Slider>
                     </Box>
                  </Grid>
               </Grid>
            </Box> */}
            <Box sx={{ mb: 6 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Produk Terbaru
               </Typography>
               {product?.data.length > 0 ? (
                  <>
                     <Grid container spacing={{ xs: 1, sm: 2 }}>
                        {product.data.map((value, index) => (
                           <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                              <ProductCard
                                 key={index}
                                 name={value.product_name}
                                 slug={value.main_product.product_slug}
                                 image={value.image}
                                 price={value.price}
                                 discount={null}
                                 discount_price={null}
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
                  </>
               ) : (
                  <Typography textAlign="center" pt={2}>
                     Belum ada produk terbaru
                  </Typography>
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
      </React.Fragment>
   );
}
