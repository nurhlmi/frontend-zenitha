import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, CircularProgress, Snackbar, IconButton } from "@mui/material";
import { Close, FavoriteRounded, FavoriteBorderRounded } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import { apiUrl } from "../variable/Url";
import { ProductCard } from "../components/Card";
import { useRecoilState } from "recoil";
import { authentication } from "../store/Authentication";

const useStyles = makeStyles((theme) => ({
   customHoverFocus: {
      padding: 5,
      backgroundColor: "#fff",
      "&:hover, &.Mui-focusVisible": { backgroundColor: "#e0e0e0" },
   },
}));

export default function Wishlist() {
   const classes = useStyles();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);

   const [data, setData] = useState();
   let params;
   if (auth.auth === true) {
      params = {
         user_id: auth.user.id,
      };
   }
   const getData = async () => {
      await axios
         .get(`${apiUrl}/user_wishlist/fetch`, {
            params: params,
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
         });
   };

   useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const [snackbar, setSnackbar] = useState(false);
   const [message, setMessage] = useState();
   const handleWishlist = async (e, product_id) => {
      e.preventDefault();
      await axios
         .delete(`${apiUrl}/user_wishlist/delete/${product_id}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            getData();
            setSnackbar(true);
            setMessage("Barang telah dihapus dari Wishlist");
         })
         .catch((err) => {
            // console.log(err.response);
         });
   };

   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" fontWeight="bold" py={3}>
            Wishlist
         </Typography>
         {data !== undefined ? (
            data.data.length > 0 ? (
               <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {data.data.map((value, index) => (
                     <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                        <ProductCard
                           key={index}
                           name={value.product.product_name}
                           slug={value.product.main_product.product_slug}
                           image={value.product.image}
                           price={value.product.price}
                           discount={value.product.discount}
                           discount_type={value.product.discount_type}
                           discount_group={value.product.discount_group}
                           discount_user={value.product.discount_user}
                           wishlist={
                              <IconButton className={classes.customHoverFocus} onClick={(e) => handleWishlist(e, value.id)}>
                                 <FavoriteRounded fontSize="small" color="error" />
                              </IconButton>
                           }
                        />
                     </Grid>
                  ))}
               </Grid>
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "60vh", color: "text.secondary" }}>
                  <FavoriteBorderRounded fontSize="large" />
                  <Typography mt={1}>Wishlist kosong</Typography>
               </Box>
            )
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <CircularProgress />
            </Box>
         )}
         <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(false)}
            message={message}
            action={
               <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
                  <Close fontSize="small" />
               </IconButton>
            }
         />
      </Container>
   );
}
