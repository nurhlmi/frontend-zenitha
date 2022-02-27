import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../style/Slider.css";
import { Container, Grid, Typography, Box, Tooltip, IconButton, TextField, MenuItem, Button, ButtonGroup, AppBar, Toolbar } from "@mui/material";
import { FavoriteRounded, FavoriteBorderRounded, Add, Remove } from "@mui/icons-material";
// import { Link as RouterLink } from "react-router-dom";

export default function ProductDetail(props) {
   const [data] = React.useState({
      name: "Long Blouse Adella 04",
      slug: "long-blouse-adella-04",
      image: "image 12.png",
      price: "159.000",
      discount: "20%",
      discount_price: "127.000",
   });
   const settings = {
      customPaging: function (i) {
         return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a>
               <img alt="Slider" src={`/assets/images/products/image ${10 + i}.png`} />
            </a>
         );
      },
      dots: true,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: "slick-dots slick-thumb",
      responsive: [
         {
            breakpoint: 600,
            settings: {
               dots: false,
            },
         },
      ],
   };
   const [wishlist, setWishlist] = React.useState(false);
   const [count, setCount] = React.useState(1);
   React.useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   return (
      <Container sx={{ flex: 1, mt: { xs: 1, sm: 0, lg: 4 } }}>
         <Grid container spacing={{ xs: 1, sm: 4 }}>
            <Grid item xs={12} lg={1} />
            <Grid item xs={12} sm={6} lg={5}>
               <Box sx={{ mb: { xs: -1.5, sm: 0 } }}>
                  <Slider {...settings}>
                     <div>
                        <img alt="Slide" src={`/assets/images/products/image 10.png`} />
                     </div>
                     <div>
                        <img alt="Slide" src={`/assets/images/products/image 11.png`} />
                     </div>
                     <div>
                        <img alt="Slide" src={`/assets/images/products/image 12.png`} />
                     </div>
                     <div>
                        <img alt="Slide" src={`/assets/images/products/image 13.png`} />
                     </div>
                     <div>
                        <img alt="Slide" src={`/assets/images/products/image 14.png`} />
                     </div>
                  </Slider>
               </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
               <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2} sx={{ display: { xs: "none", sm: "block" } }}>
                     {data.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                     <Typography variant="h5" component="div" fontWeight="bold">
                        {data.discount !== null ? `Rp${data.discount_price}` : `Rp${data.price}`}
                     </Typography>
                     <Tooltip title={wishlist === true ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}>
                        <IconButton onClick={() => setWishlist(!wishlist)}>{wishlist === true ? <FavoriteRounded /> : <FavoriteBorderRounded />}</IconButton>
                     </Tooltip>
                  </Box>
                  {data.discount !== null && (
                     <React.Fragment>
                        <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                           <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                              {data.discount}
                           </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                           <del>Rp{data.price}</del>
                        </Typography>
                     </React.Fragment>
                  )}
                  <Typography variant="subtitle1" sx={{ display: { xs: "block", sm: "none" } }} mt={1}>
                     {data.name}
                  </Typography>
               </Box>
               <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2, pb: 1, mt: 2 }}>
                  <Typography fontWeight="bold" mb={1}>
                     Pilih Varian
                  </Typography>
                  <Grid container spacing={2}>
                     <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex" }}>
                           Warna:&nbsp;<Typography color="text.secondary">2 varian</Typography>
                        </Box>
                        <TextField name="variant1" size="small" defaultValue="s" select fullWidth>
                           <MenuItem value="s" disabled selected>
                              Pilih warna
                           </MenuItem>
                           <MenuItem value={1}>Hitam</MenuItem>
                           <MenuItem value={2}>Biru</MenuItem>
                        </TextField>
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex" }}>
                           Ukuran:&nbsp;<Typography color="text.secondary">5 varian</Typography>
                        </Box>
                        <TextField name="variant2" size="small" defaultValue="s" select fullWidth>
                           <MenuItem value="s" disabled selected>
                              Pilih ukuran
                           </MenuItem>
                           <MenuItem value="S">S</MenuItem>
                           <MenuItem value="M">M</MenuItem>
                           <MenuItem value="L">L</MenuItem>
                           <MenuItem value="XL">XL</MenuItem>
                           <MenuItem value="XXL">XXL</MenuItem>
                        </TextField>
                     </Grid>
                  </Grid>
               </Box>
               <Box sx={{ display: { xs: "none", sm: "block" }, borderTop: "1px solid #e0e0e0", pt: 2, mt: 2 }}>
                  <Typography fontWeight="bold" mb={1}>
                     Atur jumlah
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                     <ButtonGroup>
                        <Button
                           aria-label="reduce"
                           onClick={() => {
                              setCount(Math.max(count - 1, 1));
                           }}
                        >
                           <Remove fontSize="small" />
                        </Button>
                        <Button>{count}</Button>
                        <Button
                           aria-label="increase"
                           onClick={() => {
                              setCount(count + 1);
                           }}
                        >
                           <Add fontSize="small" />
                        </Button>
                     </ButtonGroup>
                     <Box sx={{ display: "flex" }}>
                        <Typography color="text.secondary" ml={2}>
                           Stok
                        </Typography>
                        &nbsp;
                        <Typography fontWeight="bold">10</Typography>
                     </Box>
                  </Box>
                  <Button variant="contained" fullWidth>
                     Tambahkan ke Keranjang
                  </Button>
               </Box>
               <Box sx={{ display: { xs: "block", sm: "none" } }}>
                  <AppBar position="fixed" color="inherit" sx={{ top: "auto", bottom: 0, py: 1 }}>
                     <Toolbar>
                        <Button variant="contained" sx={{ py: 1 }} fullWidth>
                           Tambahkan ke Keranjang
                        </Button>
                     </Toolbar>
                  </AppBar>
               </Box>
            </Grid>
         </Grid>
      </Container>
   );
}
