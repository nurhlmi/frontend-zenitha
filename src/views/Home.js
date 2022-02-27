import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/Slider.css";

import { ProductCard } from "../components/Card";

import { Box, Container, Typography, Button, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Home(props) {
   const settingSlider = {
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
   const settingCategory = {
      arrows: true,
      infinite: true,
      slidesToShow: 8,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 6,
            },
         },
         {
            breakpoint: 900,
            settings: {
               slidesToShow: 5,
            },
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 3,
            },
         },
         {
            breakpoint: 500,
            settings: {
               slidesToShow: 2,
            },
         },
      ],
   };
   const settingPromo = {
      arrows: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 900,
            settings: {
               slidesToShow: 2,
            },
         },
      ],
   };
   const [products] = React.useState([
      {
         name: "Ummi 11",
         slug: "ummi-11",
         image: "image 8.png",
         price: "350.000",
         discount: "30%",
         discount_price: "219.000",
      },
      {
         name: "Long Blouse Adella 04",
         slug: "long-blouse-adella-04",
         image: "image 12.png",
         price: "159.000",
         discount: "20%",
         discount_price: "127.000",
      },
      {
         name: "Blouse Lavina 08",
         slug: "blouse-lavina-08",
         image: "image 13.png",
         price: "149.000",
         discount: "20%",
         discount_price: "119.000",
      },
      {
         name: "Gamis Kids Anissa 11",
         slug: "gamis-kids-anissa-11",
         image: "image 10.png",
         price: "269.000",
         discount: null,
         discount_price: null,
      },
      {
         name: "Znk 245",
         slug: "znk-245",
         image: "image 14.png",
         price: "117.000",
         discount: "20%",
         discount_price: "82.000",
      },
   ]);
   const [category] = React.useState([
      {
         name: "Atasan",
         slug: "atasan",
         image: "atasan.png",
      },
      {
         name: "Bayi Ibu",
         slug: "bayiibu",
         image: "bayiibu.png",
      },
      {
         name: "Gamis",
         slug: "gamis",
         image: "gamis.png",
      },
      {
         name: "Hijab",
         slug: "hijab",
         image: "hijab.png",
      },
      {
         name: "Jaket",
         slug: "jaket",
         image: "jaket.png",
      },
      {
         name: "Koko",
         slug: "koko",
         image: "koko.png",
      },
      {
         name: "Kulot",
         slug: "kulot",
         image: "kulot.png",
      },
      {
         name: "Kurta",
         slug: "kurta",
         image: "kurta.png",
      },
      {
         name: "Manset",
         slug: "manset",
         image: "manset.png",
      },
      {
         name: "Masker",
         slug: "masker",
         image: "masker.png",
      },
      {
         name: "Mukena",
         slug: "mukena",
         image: "mukena.png",
      },
      {
         name: "Rok",
         slug: "rok",
         image: "rok.png",
      },
      {
         name: "Rompi Sholat",
         slug: "rompisholat",
         image: "rompisholat.png",
      },
      {
         name: "Sarimbit",
         slug: "sarimbit",
         image: "sarimbit.png",
      },
   ]);
   React.useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   return (
      <React.Fragment>
         <Box sx={{ mb: 4 }}>
            <Slider {...settingSlider}>
               <Box component={RouterLink} to={`/article/read-promo`}>
                  <img alt="slide" src="assets/images/banners/banner.jpg" />
               </Box>
               <Box component={RouterLink} to={`/article/read-promo`}>
                  <img alt="slide" src="assets/images/banners/banner.jpg" />
               </Box>
            </Slider>
         </Box>
         <Container>
            <Box sx={{ mb: 4 }}>
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
            </Box>
            <Box sx={{ mb: 4 }}>
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
            </Box>
            <Box sx={{ mb: 6 }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Produk Terbaru
               </Typography>
               <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {products.map((value, index) => (
                     <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                        <ProductCard
                           key={index}
                           name={value.name}
                           slug={value.slug}
                           image={value.image}
                           price={value.price}
                           discount={value.discount}
                           discount_price={value.discount_price}
                        />
                     </Grid>
                  ))}
               </Grid>
               <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button variant="outlined" component={RouterLink} to="/products">
                     Lihat Semua
                  </Button>
               </Box>
            </Box>
         </Container>
         <Grid container sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
               <Box sx={{ mr: { xs: 0, md: 1 } }}>
                  <img alt="Second Banner" src={`/assets/images/banners/second-banner1.jpg`} width="100%" />
               </Box>
            </Grid>
            <Grid item xs={12} md={6}>
               <Box sx={{ ml: { xs: 0, md: 1 } }}>
                  <img alt="Second Banner" src={`/assets/images/banners/second-banner2.jpg`} width="100%" />
               </Box>
            </Grid>
         </Grid>
         <Container>
            <Grid container spacing={2} alignItems="center">
               <Grid item xs={12} md={6}>
                  <Typography fontWeight="bold" mb={2} sx={{ fontSize: { xs: "25px", sm: "30px" }, textTransform: "uppercase" }}>
                     Brand yang tersedia di toko kami
                  </Typography>
                  <Typography color="text.secondary">
                     Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex sunt maxime rem, officiis, voluptatibus itaque nostrum quaerat velit, vitae
                     asperiores labore temporibus assumenda cumque debitis alias iste a similique quia.
                  </Typography>
               </Grid>
               <Grid item xs={12} md={6}>
                  <img alt="Second Banner" src={`/assets/images/banners/bottom-banner.png`} width="100%" />
               </Grid>
            </Grid>
         </Container>
      </React.Fragment>
   );
}
